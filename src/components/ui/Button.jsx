import "./Button.css";

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <Component
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...props}
    />
  );
}
