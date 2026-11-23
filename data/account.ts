/** Static content for flow 5: notifications (AM42), followed hosts (AM48) and help (AM50 to AM72). */

export type NoticeIcon = "video" | "ticket" | "pin" | "camera" | "bell" | "alert" | "repeat" | "shield";

export const NOTIFICATIONS: { group: "Today" | "Earlier"; icon: NoticeIcon; title: string; body: string; href: string }[] = [
  { group: "Today", icon: "video", title: "Connect Lagos starts in 15 min", body: "Join opens now. Opens in the Zoom app", href: "/my-events/connect-lagos" },
  { group: "Today", icon: "ticket", title: "Your tickets are ready", body: "The Abnormal Nightout · Saved on your phone", href: "/my-events/abnormal-nightout" },
  { group: "Today", icon: "pin", title: "Ewa Garden Bar is now on Xiventa", body: "Thanks for the tip. Save it or plan a visit", href: "/places" },
  { group: "Today", icon: "camera", title: "Your photos are up on Skyline Lounge", body: "3 photos added. Thanks for sharing", href: "/places/skyline-lounge" },
  { group: "Earlier", icon: "bell", title: "Tomorrow: Jersey Creek Picnic", body: "Sun 26 Oct, 1 PM at Lagoon Park", href: "/my-events/jersey-creek-picnic" },
  { group: "Earlier", icon: "alert", title: "Venue changed for Hangover Friday", body: "Now at Skyline Lounge. Your ticket still works", href: "/events/hangover-friday" },
  { group: "Earlier", icon: "repeat", title: "Early bird ends tomorrow", body: "The Abnormal Nightout · ₦10,000 until Thu 11:59 PM, then ₦15,000", href: "/events/abnormal-nightout" },
  { group: "Earlier", icon: "repeat", title: "New date added to Friday Rush", body: "Fri 7 Nov is now on sale", href: "/events/friday-rush" },
  { group: "Earlier", icon: "shield", title: "South Circle approved your request", body: "Your ticket is in My events", href: "/my-events" },
];

export const FOLLOWED_HOSTS: { slug: string; name: string; initials: string; verified?: boolean; meta: string; href: string }[] = [
  { slug: "south-circle", name: "South Circle", initials: "SC", verified: true, meta: "Party host · 3 upcoming", href: "/hosts/south-circle" },
  { slug: "lagos-outdoor-club", name: "Lagos Outdoor Club", initials: "LO", meta: "Community · 1 upcoming", href: "/hosts/lagos-outdoor-club" },
  { slug: "sound-hub", name: "Sound Hub", initials: "SH", meta: "Music · 2 upcoming", href: "/hosts/sound-hub" },
  { slug: "skyline-lounge", name: "Skyline Lounge", initials: "SL", verified: true, meta: "Place · open tonight", href: "/places/skyline-lounge" },
];

export interface HelpTopic {
  slug: string;
  title: string;
  sub: string;
  icon: "ticket" | "wallet" | "building" | "user";
  articles: { slug: string; title: string; body: string[]; note?: string }[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    slug: "tickets",
    title: "Tickets",
    sub: "Finding, sharing and showing your ticket",
    icon: "ticket",
    articles: [
      { slug: "find-ticket", title: "Where do I find my ticket?", body: ["Your tickets are in My events. Open one to see the QR code the door scans.", "Tickets are saved on your phone, so they work without data at the gate."] },
      { slug: "send-ticket", title: "How do I send a ticket to a friend?", body: ["Open the ticket and tap Send to a friend. They get a link to claim it in Xiventa.", "Your copy keeps working until they accept, and you can cancel before then. Transfers are free."] },
      { slug: "not-let-in", title: "I wasn't let in with a valid ticket", body: ["Open the ticket, tap Get help with this order and choose Not let in. The host replies first.", "If it is not sorted within 48 hours, Xiventa reviews it and decides."] },
    ],
  },
  {
    slug: "payments",
    title: "Payments and refunds",
    sub: "Charges, refunds and where money goes",
    icon: "wallet",
    articles: [
      { slug: "charged-twice", title: "Why was I charged twice?", body: ["Sometimes a bank holds the amount twice while a payment is confirmed. The extra hold drops off on its own, usually within a few days.", "If both charges complete, open the order and choose Charged wrongly. We sort it with the payment partner."] },
      {
        slug: "refund-time",
        title: "When will my refund arrive?",
        body: [
          "Once the host approves your refund, we send it back to the card or account you paid with.",
          "How long it takes depends on your bank. Most refunds show up within a few working days. The exact time we promise is shown on your order once the refund starts.",
        ],
        note: "You can follow every step from My events, then Order details.",
      },
      { slug: "failed-payment", title: "My payment failed but money left my account", body: ["If a payment fails after your bank takes the money, it goes back automatically. This can take up to a few working days.", "Keep the order code from the failed screen. If the money isn't back, start a case and include it."] },
      { slug: "change-name", title: "Can I change the name on a ticket?", body: ["Send the ticket to the person who is going instead. They claim it with their own account, and the new name shows on their copy."] },
    ],
  },
  {
    slug: "hosting",
    title: "Hosting",
    sub: "Creating events, verification, payouts",
    icon: "building",
    articles: [
      { slug: "payouts", title: "How do payouts work?", body: ["Ticket money goes to your Xiventa wallet. After the event ends it is paid to your bank on the schedule shown in your wallet."] },
      { slug: "verified", title: "How do I get verified?", body: ["Verification is only needed to sell paid tickets. Free events can go live straight away.", "We check your bank details and ID once. It usually takes a working day."] },
      { slug: "instagram", title: "Can I list an event ticketed on Instagram?", body: ["Yes. List it as an Instagram event and people are sent to your page to buy. Xiventa does not handle those payments, refunds or entry."] },
      { slug: "check-in-staff", title: "How do I add check in staff?", body: ["In the host dashboard, open Team and add staff by phone number. They scan tickets in the app, even when the network drops."] },
    ],
  },
  {
    slug: "account",
    title: "Account",
    sub: "Sign in, phone number, privacy",
    icon: "user",
    articles: [
      { slug: "change-phone", title: "How do I change my phone number?", body: ["Go to Profile, then Account, and type the new number. We send a code to confirm it."] },
      { slug: "delete", title: "How do I delete my account?", body: ["Go to Profile, then Privacy, then Delete account. Forward or download any upcoming tickets first."] },
    ],
  },
];

/** Footer link /help/host is the Hosting topic. */
export const getHelpTopic = (slug: string) => HELP_TOPICS.find((t) => t.slug === (slug === "host" ? "hosting" : slug));

export const LEGAL_PAGES: { slug: string; title: string; sections: [string, string][] }[] = [
  {
    slug: "terms",
    title: "Terms",
    sections: [
      ["Using Xiventa", "Xiventa helps you find events and places in Lagos, buy tickets and keep track of where you go. You need an account to buy tickets, save things and get alerts."],
      ["Tickets", "A ticket is an agreement between you and the host. Xiventa sells it on the host's behalf and checks that the host's refund policy is followed."],
      ["Your account", "Keep your phone number up to date so we can reach you about your orders. One person, one account."],
      ["Changes to these terms", "When the terms change we tell you in the app before the new version applies."],
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    sections: [
      ["What we collect", "Your name, phone number, email if you add one, the events you buy or save and the places you plan to visit."],
      ["What hosts see", "Hosts only see the name on your ticket, never your phone number or email."],
      ["Your location", "We use it to sort what is close to you, only while you use the app. Hosts never see where you are."],
      ["Your choices", "You can download your data or delete your account from Profile, then Privacy."],
    ],
  },
  {
    slug: "refunds",
    title: "Refund policy",
    sections: [
      ["Who sets the refund rules", "Each host chooses a refund policy when they create paid tickets. It is shown on the event page and at checkout before you pay."],
      ["When an event is cancelled", "If a host cancels, everyone with a ticket is refunded under Xiventa cancellation rules. You do not need to do anything."],
      ["When an event changes", "If the date, time or venue changes, you can keep your ticket or ask for a refund within the time shown in the message we send."],
      ["Service fees", "Whether the service fee is refunded depends on the reason for the refund. Fees are set by Xiventa and shown before you pay."],
      ["How long refunds take", "Refunds go back to the way you paid. Your bank or payment provider decides how long it takes to reach you."],
    ],
  },
  {
    slug: "cookies",
    title: "Cookies",
    sections: [
      ["Needed cookies", "These keep you signed in and remember your city. They are always on."],
      ["Analytics", "Helps us see what works, like which searches find nothing. Off unless you turn it on."],
      ["Marketing", "Lets us show you Xiventa ads elsewhere. Off unless you turn it on."],
      ["Changing your mind", "Open Cookie settings at the bottom of any page."],
    ],
  },
  {
    slug: "content-rules",
    title: "Content rules",
    sections: [
      ["Be real", "Events, places, photos and reviews must be real and your own."],
      ["Be safe", "No events or content that put people at risk, break the law or target a group of people."],
      ["Reviews", "Reviews come from real visits. Hosts can reply but cannot remove a fair review."],
      ["Reporting", "Use Report on any event, place or review. Our team checks every report."],
    ],
  },
];
