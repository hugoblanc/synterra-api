import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class CustomTableNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    targetName = super.tableName(targetName, userSpecifiedName);
    if (userSpecifiedName) {
      return userSpecifiedName;
    }

    if (targetName.endsWith('_entity')) {
      targetName = targetName.slice(0, -7);
    }
    return targetName;
  }
}
