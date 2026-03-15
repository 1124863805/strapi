import type { UID, Modules } from '@leao1/types';

export type RepositoryFactoryMethod = <TContentTypeUID extends UID.ContentType>(
  uid: TContentTypeUID,
  entityValidator: Modules.EntityValidator.EntityValidator
) => Modules.Documents.ServiceInstance<TContentTypeUID>;

export const wrapInTransaction = (fn: (...args: any) => any) => {
  return (...args: any[]) => leao.db.transaction?.(() => fn(...args));
};
