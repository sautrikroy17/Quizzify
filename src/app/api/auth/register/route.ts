import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validate as deepEmailValidate } from "deep-email-validator";

// Blocked free/personal email providers — only institutional emails allowed
const BLOCKED_PROVIDERS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.in", "yahoo.co.uk", "yahoo.in", "ymail.com",
  "hotmail.com", "hotmail.co.uk", "hotmail.in",
  "outlook.com", "outlook.in", "outlook.co.uk",
  "live.com", "live.co.uk", "live.in",
  "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com",
  "protonmail.com", "pm.me", "proton.me",
  "rediffmail.com",
  "mail.com", "yandex.com", "yandex.ru",
  "zoho.com",
]);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Block common free/personal email providers
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain || BLOCKED_PROVIDERS.has(domain)) {
      return NextResponse.json(
        { error: "Personal email addresses (Gmail, Yahoo, etc.) are not allowed. Please use your institutional email." },
        { status: 400 }
      );
    }

    // Deep email validation — blocks disposable domains, bad MX records, typos
    const emailValidation = await deepEmailValidate({
      email: email,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });

    if (!emailValidation.valid && emailValidation.reason !== 'smtp') {
      return NextResponse.json({ error: "Please provide a valid institutional email address." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User registered successfully", userId: user.id }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
