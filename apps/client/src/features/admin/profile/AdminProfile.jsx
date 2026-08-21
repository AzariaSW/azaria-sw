import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useProfile from "../../profile/hooks/useProfile";
import useUpdateProfile from "../../profile/hooks/useUpdateProfile";
import profileSchema from "../../profile/validation/profile.schema";
import { Button, Card, Input } from "../../../components/common";
import { Spinner, Skeleton } from "../../../components/feedback";
import "./AdminProfile.css";

export default function AdminProfile() {
  const { data: profile, isLoading, isError } = useProfile();

  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      fullName: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      telegram: "",
      location: "",
      github: "",
      linkedin: "",
      profileImage: undefined,
      resume: undefined,
      cv: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? "",
        title: profile.title ?? "",
        bio: profile.bio ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        telegram: profile.telegram ?? "",
        location: profile.location ?? "",
        github: profile.github ?? "",
        linkedin: profile.linkedin ?? "",
      });
    }
  }, [profile, reset]);

  function onSubmit(data) {
    const profileData = {
      ...data,
      profileImage: data.profileImage?.[0],
      resume: data.resume?.[0],
      cv: data.cv?.[0],
    };

    updateProfile.mutate(profileData, {
      onSuccess: () => {
        resetField("profileImage");
        resetField("resume");
        resetField("cv");
      },
    });
  }

  if (isLoading) {
    return (
      <main className="admin-profile">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-profile">
        <p>Failed to load profile.</p>
      </main>
    );
  }

  return (
    <main className="admin-profile">
      <header className="admin-profile__header">
        <div>
          <h1>Profile</h1>
          <p>Manage the information displayed on your public portfolio.</p>
        </div>
      </header>

      <form className="admin-profile__form" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="admin-profile__section">
            <div className="admin-profile__section-header">
              <h2>Basic Information</h2>
              <p>Your name, professional title, and biography.</p>
            </div>

            <div className="admin-profile__fields">
              <Input
                label="Full Name"
                placeholder="Your full name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <Input
                label="Title"
                placeholder="e.g. Backend Developer"
                error={errors.title?.message}
                {...register("title")}
              />

              <Input
                as="textarea"
                rows={7}
                label="Bio"
                placeholder="Tell visitors about yourself..."
                error={errors.bio?.message}
                {...register("bio")}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="admin-profile__section">
            <div className="admin-profile__section-header">
              <h2>Contact Information</h2>
              <p>How visitors can get in touch with you.</p>
            </div>

            <div className="admin-profile__fields admin-profile__fields--two-column">
              <Input
                type="email"
                label="Email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Phone"
                placeholder="+251..."
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="Telegram"
                placeholder="username"
                error={errors.telegram?.message}
                {...register("telegram")}
              />

              <Input
                label="Location"
                placeholder="Addis Ababa, Ethiopia"
                error={errors.location?.message}
                {...register("location")}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="admin-profile__section">
            <div className="admin-profile__section-header">
              <h2>Social Links</h2>
              <p>Links to your professional profiles.</p>
            </div>

            <div className="admin-profile__fields admin-profile__fields--two-column">
              <Input
                label="GitHub"
                placeholder="https://github.com/..."
                error={errors.github?.message}
                {...register("github")}
              />

              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/in/..."
                error={errors.linkedin?.message}
                {...register("linkedin")}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="admin-profile__section">
            <div className="admin-profile__section-header">
              <h2>Files</h2>
              <p>Manage your profile image, resume, and CV.</p>
            </div>

            <div className="admin-profile__fields">
              <Input
                type="file"
                label="Profile Image"
                accept=".jpg,.jpeg,.png,.webp"
                error={errors.profileImage?.message}
                {...register("profileImage")}
              />

              <Input
                type="file"
                label="Resume"
                accept=".pdf"
                error={errors.resume?.message}
                {...register("resume")}
              />

              <Input
                type="file"
                label="CV"
                accept=".pdf"
                error={errors.cv?.message}
                {...register("cv")}
              />
            </div>
          </div>
        </Card>

        <div className="admin-profile__actions">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? <Spinner /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </main>
  );
}
