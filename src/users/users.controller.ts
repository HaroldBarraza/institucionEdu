
import { Roles } from '../auth/decorators/roles.decorators.js';
import { Controller, Delete, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update.user.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiTags("empleados")
@ApiBearerAuth()
@Controller('users')
@Roles('RECEPCIONISTA','GERENCIA')
export class UsersController {
    constructor(private readonly UsersService: UsersService){}
    @ApiOperation({summary: "obtener la lista de todos los empleados"})
    @Get()
    findAll(){
        return this.UsersService.findAll()
    }
    @ApiOperation({summary: "obtener informacion de un empleado segun id"})
    @Get(":id")
    findOne(@Param("id") id: string){
        return this.UsersService.findOne(+id)
    }
    @ApiOperation({summary: "actualizar la informacion de una empleado segun id "})
    @Patch(":id")
    update(@Param("id") id: string, @Body() UpdateUserDto: UpdateUserDto ){
        return this.UsersService.update(+id, UpdateUserDto)
    }
    @ApiOperation({summary: "eliminar a un empleado"})
    @Delete(":id")
    remove(@Param("id") id:string){
        return this.UsersService.remove(+id)
    }
    @Get("medicos")
    findMedico(@Query("especialidad") especialidad:string){
        return this.UsersService.findEspecialidad(especialidad)
    }
}
