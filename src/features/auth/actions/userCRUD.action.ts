"use server";

import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

import { registerSchema } from "@/validations/auth.validation";

export async function allUserAction() {
  try {
    await connectDB();

    const users = await User.find({
      isDeleted: false,
    }).lean();

   

    if (users.length === 0) {
      return {
        success: false,
        message: "User Not Found",
      };
    }

    return {
      success: true,
      message: "User fetch successfully",
      data: users,
    };
  } catch (error) {
    if (error) {
      return {
        success: false,
        message: error?.message,
      };
    }

    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function deletedUser() {
  try {
    await connectDB();

    const users = await User.find({
      isDeleted: true,
    }).lean();

    if (users.length === 0) {
      return {
        success: false,
        message: "User Not Found",
      };
    }

    return {
      success: true,
      message: "Deleted user fetch successfully",
      data: users,
    };
  } catch (error) {
    if (error) {
      return {
        success: false,
        message: error?.message,
      };
    }

    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

import { signIn } from "@/auth";

export async function loginAction(email: string, password: string) {
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function registerAction(data: unknown) {
  try {
    const result = registerSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: result.data.email,
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const user = await User.create(result.data);

    return {
      success: true,
      message: "User created successfully",
      data: user,
    };
  } catch (error) {
    if (error) {
      return {
        success: false,
        message: error?.message,
      };
    }

    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateActive(id: unknown) {
  try {
    await connectDB();

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    existingUser.active = !existingUser.active;

    const result = await existingUser.save();

    return {
      success: true,
      message: `${existingUser.name} ${existingUser.active ? "activated" : "deactivated"} successfully`,
      data: result,
    };
  } catch (error) {
    if (error) {
      return {
        success: false,
        message: error?.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
export async function userDelete(id: unknown) {
  try {
    await connectDB();

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    existingUser.isDeleted = !existingUser.isDeleted;

    if (existingUser.isDeleted) {
      existingUser.active = false;
    }

    const result = await existingUser.save();

    return {
      success: true,
      message: `${existingUser.name} ${existingUser.isDeleted ? "Deleted" : "Restored"} successfully`,
      data: result,
    };
  } catch (error) {
    if (error) {
      return {
        success: false,
        message: error?.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

import { signOut } from "@/auth";
import { auth } from "@/auth";

export async function logoutAction() {
  const session = await auth();

  if (!session) return;

  if (session.user?.id) {
    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
      online: false,
      lastOnline: new Date(),
    });
  }
  await signOut({
    redirectTo: "/login",
  });
}

import { z } from "zod";
import { passwordSchema } from "@/validations/auth.validation";

export async function resetPasswordAction(data: unknown) {
  const passwordSchemas = z.object({
    password: passwordSchema,
  });

  const result = passwordSchemas.safeParse(data.password);

  if (!result.success) {
    return {
      success: false,
      message: result.error.message,
    };
  }

  const { password } = result.data;
  const id = data?.id;
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    user.password = password;
    await user.save();
  } catch (error) {
    if (error) {
      return {
        success: false,
        message: error?.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
