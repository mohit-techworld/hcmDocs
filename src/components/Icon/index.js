import React from "react";
import * as Lucide from "lucide-react";
import styles from "./styles.module.css";

/**
 * A single icon vocabulary for the whole site.
 *
 * Every icon is a stroked Lucide glyph rendered in `currentColor`, so it
 * inherits the surrounding text colour and works in both themes without a
 * second asset. This replaces the emoji the site previously used as icons,
 * which rendered differently per platform, could not be themed, and were
 * announced by screen readers.
 *
 * Usage in MDX (registered globally, no import needed):
 *   <Icon name="shield" /> Authentication
 *   <Icon name="check" label="Supported" />
 */

// Semantic name -> Lucide component. Add to this map rather than importing
// Lucide directly at call sites, so the vocabulary stays reviewable.
const ICONS = {
  // people & org
  users: Lucide.Users,
  user: Lucide.User,
  building: Lucide.Building2,
  hierarchy: Lucide.Network,
  handshake: Lucide.Handshake,
  wave: Lucide.LogOut,

  // time
  clock: Lucide.Clock,
  calendar: Lucide.CalendarDays,
  roster: Lucide.CalendarRange,

  // money
  wallet: Lucide.Wallet,
  receipt: Lucide.ReceiptText,

  // work
  check: Lucide.CircleCheck,
  cross: Lucide.CircleX,
  warning: Lucide.TriangleAlert,
  info: Lucide.Info,
  ticket: Lucide.Ticket,
  task: Lucide.ListChecks,
  target: Lucide.Target,
  search: Lucide.Search,
  chat: Lucide.MessagesSquare,

  // data
  chart: Lucide.ChartColumn,
  trending: Lucide.TrendingUp,
  gauge: Lucide.Gauge,
  database: Lucide.Database,

  // assets & docs
  doc: Lucide.FileText,
  folder: Lucide.Folder,
  box: Lucide.Package,
  pin: Lucide.MapPin,

  // platform
  settings: Lucide.Settings,
  shield: Lucide.ShieldCheck,
  key: Lucide.KeyRound,
  plug: Lucide.Cable,
  server: Lucide.Server,
  cloud: Lucide.CloudUpload,
  rocket: Lucide.Rocket,
  code: Lucide.Code2,
  terminal: Lucide.SquareTerminal,
  bell: Lucide.Bell,
  layers: Lucide.Layers,
  book: Lucide.BookOpen,
};

export const ICON_NAMES = Object.keys(ICONS);

export default function Icon({ name, label, size = 18, className, ...rest }) {
  const Glyph = ICONS[name];

  if (!Glyph) {
    // Fail loudly in development, harmlessly in production.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `<Icon name="${name}"> is not in the icon vocabulary. ` +
          `Add it to src/components/Icon/index.js. Known names: ${ICON_NAMES.join(", ")}`
      );
    }
    return null;
  }

  // An icon with a label is meaningful and gets an accessible name; an icon
  // without one is decorative and is hidden from assistive technology.
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": "true", focusable: "false" };

  return (
    <Glyph
      size={size}
      strokeWidth={1.75}
      className={[styles.icon, className].filter(Boolean).join(" ")}
      {...a11y}
      {...rest}
    />
  );
}
