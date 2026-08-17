import { useEffect, useState } from "react";

import useMessage from "../../../features/contact/hooks/useMessage";
import useMarkAsRead from "../../../features/contact/hooks/useMarkAsRead";
import useDeleteMessage from "../../../features/contact/hooks/useDeleteMessage";
import Icon from "../../../lib/icons/Icon";
import { ChevronLeft } from "../../../lib/icons";
import { Button, Card } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";
import "./AdminMessages.css";

export default function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [show, setShow] = useState("all");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1023);

  const { data, isLoading, isError } = useMessage();
  const markAsRead = useMarkAsRead();
  const deleteMessage = useDeleteMessage();

  const messages = data?.items ?? [];
  const filteredMessages = messages.filter((message) => {
    if (show === "unread") {
      return !message.isRead;
    }

    if (show === "read") {
      return message.isRead;
    }

    return true;
  });

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth <= 1023);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleSelectMessage(message) {
    setSelectedMessage(message);

    if (!message.isRead) {
      markAsRead.mutate(message.id);
    }
  }

  function handleBack() {
    setSelectedMessage(null);
  }

  function handleDelete(message) {
    const confirmed = window.confirm(
      `Delete the message from "${message.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMessage.mutate(message.id, {
      onSuccess() {
        setSelectedMessage(null);
      },
    });
  }

  if (isLoading) {
    return (
      <main className="admin-messages">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-messages">
        <p className="failed">Failed to load messages.</p>
      </main>
    );
  }

  const showList = !isSmallScreen || !selectedMessage;

  return (
    <main className="admin-messages">
      <header className="admin-messages__header">
        <div>
          <h1>Messages</h1>

          <p>Manage messages received through your portfolio.</p>
        </div>

        <label className="admin-messages__filter">
          <span>Show</span>

          <select
            value={show}
            onChange={(event) => setShow(event.target.value)}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </label>
      </header>

      <section
        className={`admin-messages__workspace ${
          selectedMessage
            ? "admin-messages__workspace--selected"
            : "admin-messages__workspace--empty"
        }`}
      >
        {showList && (
          <section className="admin-messages__list">
            {filteredMessages.length === 0 ? (
              <Card>
                <p className="admin-messages__empty">
                  {show === "unread"
                    ? "No unread messages."
                    : show === "read"
                      ? "No read messages."
                      : "No messages yet."}
                </p>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <button
                  type="button"
                  key={message.id}
                  className={`admin-message ${
                    !message.isRead ? "admin-message--unread" : ""
                  } ${
                    selectedMessage?.id === message.id
                      ? "admin-message--selected"
                      : ""
                  }`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="admin-message__avatar">
                    {message.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="admin-message__content">
                    <div className="admin-message__top">
                      <strong>{message.name}</strong>

                      <time>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </time>
                    </div>

                    <div className="admin-message__middle">
                      <span>{message.subject}</span>

                      {!message.isRead && (
                        <span className="admin-message__unread-dot" />
                      )}
                    </div>

                    <p>{message.message}</p>
                  </div>
                </button>
              ))
            )}
          </section>
        )}

        {selectedMessage && (
          <aside className="admin-messages__detail">
            <Card>
              <article className="admin-message-detail">
                <button
                  type="button"
                  className="admin-message-detail__back"
                  onClick={handleBack}
                >
                  <Icon icon={ChevronLeft}/> Back
                </button>

                <header className="admin-message-detail__header">
                  <div>
                    <h2>{selectedMessage.subject}</h2>

                    <p>
                      {selectedMessage.name}
                      {" · "}
                      {selectedMessage.email}
                    </p>
                  </div>

                  <time>
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </time>
                </header>

                <div className="admin-message-detail__body">
                  <p>{selectedMessage.message}</p>
                </div>

                <footer className="admin-message-detail__actions">
                  <Button
                    as="a"
                    variant="secondary"
                    href={`mailto:${selectedMessage.email}`}
                  >
                    Replay
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={deleteMessage.isPending}
                    onClick={() => handleDelete(selectedMessage)}
                  >
                    Delete
                  </Button>
                </footer>
              </article>
            </Card>
          </aside>
        )}
      </section>
    </main>
  );
}
