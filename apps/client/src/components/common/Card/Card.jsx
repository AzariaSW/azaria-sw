import styles from "./Card.module.css";

function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  as: Component = "article",
  ...props
}) {
  return (
    <Component
      className={[
        styles.card,
        styles[padding],
        hover && styles.hover,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;