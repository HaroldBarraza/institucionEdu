import { SetMetadata } from "@nestjs/common";
import { role } from "../../prisma/generated/prisma/enums.js";

export const Roles = (...role:string[]) => SetMetadata('roles',role)
