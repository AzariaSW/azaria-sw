import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Section } from "../../../components/layout";
import { Spinner } from "../../../components/feedback";
import contactSchema from "../../contact/validation/contact.schema";
import useSendMessage from "../../contact/hooks/useSendMessage";
import useProfile from "../../profile/hooks/useProfile";
import { Button, Input, Reveal } from "../../../components/common";

import "./Contact.css";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),

    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { data: profile } = useProfile();
  const { location, phone, linkedin, email, telegram } = profile ?? {};

  const sendMessage = useSendMessage({
    onSuccess: () => {
      reset();
    },
  });

  function onSubmit(data) {
    sendMessage.mutate(data);
  }
  return (
    <section id="contact">
      <Section
        title="Contact"
        description="Have a project, internship, or opportunity? I'd love to hear from you."
      >
        <div className="contact">
          <Reveal delay={0.2}>
            <div className="contact__info">
              <h3>Get In Touch</h3>

              <p>
                Whether you have an internship opportunity, freelance project,
                or simply want to connect, feel free to reach out.
              </p>

              <div className="contact__item">
                <h4>Email</h4>

                <a href={`mailto:${email}`}>{email}</a>
              </div>

              <div className="contact__item">
                <h4>Phone</h4>

                <a href={`tel:${phone}`}>{phone}</a>
              </div>

              <div className="contact__item">
                <h4>Linkedin</h4>
                <a href={linkedin}>{linkedin}</a>
              </div>

              <div className="contact__item">
                <h4>Telegram</h4>
                <a href={`https://t.me/${telegram}`}>{telegram}</a>
              </div>

              <div className="contact__item">
                <h4>Location</h4>

                <p>{location}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="contact__form">
              <h3>Send a Message</h3>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Name"
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Subject"
                  placeholder="Subject"
                  error={errors.subject?.message}
                  {...register("subject")}
                />
                <Input
                  as="textarea"
                  rows={6}
                  label="Message"
                  placeholder="Write your message..."
                  error={errors.message?.message}
                  {...register("message")}
                />
                <Button type="submit" disabled={sendMessage.isPending}>
                  {sendMessage.isPending ? <Spinner /> : "Send Message"}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </Section>
    </section>
  );
}
