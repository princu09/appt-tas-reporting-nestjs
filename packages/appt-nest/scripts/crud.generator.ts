import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { exit } from 'process';
import { ApiTags } from '@nestjs/swagger';

const generateResource = (name: string) => {
  const dir = process.cwd() + '/src/auto-resources/' + name
  if (!existsSync(dir)) {
    console.log(`creating: ${dir}`)
    mkdirSync(dir);
  } else {
    console.log(`${dir}: Already exists we are exiting!`)
    return
  }
  { // create control file
    console.log(`creating: ${dir + '/' + `${name}.controller.ts`}`)
    writeFileSync(dir + '/' + `${name}.controller.ts`, `import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { ${name}, ${name}DTO } from './${name}.entity';
import { ${name}Service } from './${name}.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';

@Crud({
  model: {
    type: ${name},
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true
    }
  },
  dto: {
    update: ${name}DTO,
    create: ${name}DTO,
    replace: ${name}DTO
  },
  ...defaultCrudPermissions('${name}')
})
@ApiTags('${name.toLocaleLowerCase()}')
@Controller('${name.toLocaleLowerCase()}')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class ${name}Controller implements CrudController<${name}> {
  constructor(public service: ${name}Service) { }
}`)
  }
  { // create service file
    console.log(`creating: ${dir + '/' + `${name}.service.ts`}`)
    writeFileSync(dir + '/' + `${name}.service.ts`, `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ${name} } from './${name}.entity';

@Injectable()
export class ${name}Service extends TypeOrmCrudService<${name}> {
  constructor(@InjectRepository(${name}) repo) {
    super(repo);
  }
}`)
  }
  { // create entity file
    console.log(`creating: ${dir + '/' + `${name}.entity.ts`}`)
    writeFileSync(dir + '/' + `${name}.entity.ts`, `import { IsOptional, IsUUID } from 'class-validator';
import { Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity'
import { ApptBaseEntity } from '../../base/appt-base-dto'

@Entity('${name.toLocaleLowerCase()}')
export class ${name} extends ApptBaseEntity {

}

export class ${name}DTO extends ApptBaseDTO {
  @IsOptional()
  @IsUUID()
  owner: string | null;

  @IsOptional()
  @IsUUID()
  organisation: string | null;

  @IsOptional()
  @IsUUID()
  site: string | null;
}`)
  }
  { // create module file
    console.log(`creating: ${dir + '/' + `${name}.module.ts`}`)
    writeFileSync(dir + '/' + `${name}.module.ts`, `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { ${name}Controller } from './${name}.controller';
import { ${name}Service } from './${name}.service';
import { ${name} } from './${name}.entity';

@Module({
  controllers: [${name}Controller],
  providers: [${name}Service],
  imports: [TypeOrmModule.forFeature([${name}]), PermissionsModule]
})
export class ${name}Module {}`)
  }
  console.log('Finished!')
}

const model = process.argv[2]

if(!model) {
  console.log('No model name passed in exiting')
  exit()
}
generateResource(model)
