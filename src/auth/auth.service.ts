import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service.js';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService:UsuarioService,
        private readonly jwtService:JwtService
    ){}
    async validateUser(email:string, pass: string):Promise<any>{
        const user = await this.usuarioService.findemail(email)
        if(user && (await bcrypt.compare(pass, user.password))){
            const {password, ...result} = user
            return result
        }
        return null
    }
    async login(usuario:any){
        const payload = {
            sub: usuario.id_usuario,
            email: usuario.email,
            rol: usuario.rol,
            id: usuario.id_usuario,
            estado: usuario.estado,
        };
        return {
            access_token:this.jwtService.sign(payload)
        }
    }
}
 