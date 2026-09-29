import { SetMetadata } from "@nestjs/common";
import { Role } from "../../generated/prisma/enums.js";

export const ROLES_KEY = "roles";
export const Roles = (...role:Role[]) => SetMetadata(ROLES_KEY,role)
