import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, Permission, ROLE_PERMISSIONS } from '@/common/types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован');
    }

    // SUPER_ADMIN имеет доступ ко всем маршрутам
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Проверяем роли
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Недостаточно прав доступа');
    }

    // Проверяем разрешения
    if (requiredPermissions) {
      const userPermissions = ROLE_PERMISSIONS[user.role] || [];
      const hasAllPermissions = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        throw new ForbiddenException('Недостаточно разрешений');
      }
    }

    return true;
  }
}
