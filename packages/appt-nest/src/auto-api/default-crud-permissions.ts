import { SetMetadata, UseGuards } from '@nestjs/common';
import { UserHasPermissionGuard } from '../guards/user-has-permission.guard';

export const defaultCrudPermissions = (model: string) => {
  return {
    routes: {
      getManyBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}GetMany`]),
        ],
      },
      getOneBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}GetOne`]),
        ],
      },
      createOneBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}CreateOne`]),
        ],
      },
      createManyBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}CreateMany`]),
        ],
      },
      updateOneBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}UpdateOne`]),
        ],
      },
      replaceOneBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}ReplaceOne`]),
        ],
      },
      deleteOneBase: {
        decorators: [
          UseGuards(UserHasPermissionGuard),
          SetMetadata('permissions', [`${model}DeleteOne`]),
        ],
      },
    },
  };
};

export const defaultCrudPermissionNoRoute = (model: string) => {
  return {
    getManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}GetMany`]),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}GetOne`]),
      ],
    },
    createOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}CreateOne`]),
      ],
    },
    createManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}CreateMany`]),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}UpdateOne`]),
      ],
    },
    replaceOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}ReplaceOne`]),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`${model}DeleteOne`]),
      ],
    },
  };
};
