-- Initial schema for announcements app
-- Generated from lib/db/schema.ts

-- Create announcements table
CREATE TABLE IF NOT EXISTS "announcements" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"experience_id" varchar(64) NOT NULL,
	"author_id" varchar(64) NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"content_text" TEXT,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"pinned" boolean DEFAULT false,
	"is_admin_post" boolean DEFAULT false,
	"notification_link" varchar(500),
	"send_admin_notifications" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS "reactions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"announcement_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"reaction_type" varchar(10) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS "notification_settings" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"experience_id" varchar(64) NOT NULL,
	"new_announcements" boolean DEFAULT true NOT NULL,
	"reactions" boolean DEFAULT true NOT NULL,
	"comments" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create views table
CREATE TABLE IF NOT EXISTS "views" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"announcement_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "announcements_experience_idx" ON "announcements" ("experience_id");
CREATE INDEX IF NOT EXISTS "announcements_status_idx" ON "announcements" ("status");
CREATE INDEX IF NOT EXISTS "reactions_announcement_idx" ON "reactions" ("announcement_id");
CREATE INDEX IF NOT EXISTS "views_announcement_idx" ON "views" ("announcement_id");

-- Create unique index to prevent duplicate reactions
CREATE UNIQUE INDEX IF NOT EXISTS "reactions_unique_idx" ON "reactions" ("announcement_id", "user_id", "reaction_type");

-- Create index for full-text search on content_text
CREATE INDEX IF NOT EXISTS "announcements_content_text_idx" ON "announcements" USING gin(to_tsvector('english', COALESCE(content_text, '')));

-- Add comments for documentation
COMMENT ON TABLE "announcements" IS 'Stores announcement posts for experiences';
COMMENT ON TABLE "reactions" IS 'Stores user reactions (emoji) to announcements';
COMMENT ON TABLE "notification_settings" IS 'Stores user notification preferences per experience';
COMMENT ON TABLE "views" IS 'Tracks announcement views by users';

COMMENT ON COLUMN "announcements"."status" IS 'Status: draft, published, or scheduled';
COMMENT ON COLUMN "reactions"."reaction_type" IS 'Emoji reaction type: 👍, 🔥, 🐐, 💯';
