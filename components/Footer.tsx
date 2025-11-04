export default function Footer() {
  return (
    <footer className="border-t bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="cc-container flex h-16 items-center justify-between text-sm text-(--cc-text-muted)">
        <p>© {new Date().getFullYear()} CommunityConnect</p>
        <p>
          Built for communities •{" "}
          <a
            className="underline decoration-(--cc-primary) underline-offset-4"
            href="#"
          >
            Learn more
          </a>
        </p>
      </div>
    </footer>
  );
}
