/**
 *
 * FormModalEndActions
 *
 */

import { SyntheticEvent, useEffect, useRef, useState } from 'react';

import { Dialog, Flex, ModalActionView, Plus } from '../ui';
import { ConfirmDialog } from '../ConfirmDialog';
import { useIntl } from 'react-intl';

import { getTrad } from '../utils';

type DeleteConfirmType = 'contentType' | 'component' | 'category';

type FormModalEndActionsProps = {
  categoryName?: string;
  deleteCategory: (categoryName: string) => void;
  deleteComponent: () => void;
  deleteContentType: () => void;
  isAttributeModal: boolean;
  isCustomFieldModal: boolean;
  isComponentAttribute: boolean;
  isComponentModal: boolean;
  isComponentToDzModal: boolean;
  isContentTypeModal: boolean;
  isCreatingComponent: boolean;
  isCreatingComponentAttribute: boolean;
  isCreatingComponentInDz: boolean;
  isCreatingComponentWhileAddingAField: boolean;
  isCreatingContentType: boolean;
  isCreatingDz: boolean;
  isDzAttribute: boolean;
  isEditingAttribute: boolean;
  isEditingCategory: boolean;
  isInFirstComponentStep: boolean;
  onSubmitAddComponentAttribute: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitAddComponentToDz: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitCreateContentType: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitCreateComponent: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitCreateDz: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitEditAttribute: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitEditCategory: (e: SyntheticEvent) => void;
  onSubmitEditComponent: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitEditContentType: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitEditCustomFieldAttribute: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onSubmitEditDz: (e: SyntheticEvent, shouldContinue: boolean) => void;
  onClickFinish: () => void;
};

export const FormModalEndActions = ({
  categoryName,
  deleteCategory,
  deleteComponent,
  deleteContentType,
  isAttributeModal,
  isCustomFieldModal,
  isComponentAttribute,
  isComponentToDzModal,
  isContentTypeModal,
  isCreatingComponent,
  isCreatingComponentAttribute,
  isCreatingComponentInDz,
  isCreatingComponentWhileAddingAField,
  isCreatingContentType,
  isCreatingDz,
  isComponentModal,
  isDzAttribute,
  isEditingAttribute,
  isEditingCategory,
  isInFirstComponentStep,
  onSubmitAddComponentAttribute,
  onSubmitAddComponentToDz,
  onSubmitCreateContentType,
  onSubmitCreateComponent,
  onSubmitCreateDz,
  onSubmitEditAttribute,
  onSubmitEditCategory,
  onSubmitEditComponent,
  onSubmitEditContentType,
  onSubmitEditCustomFieldAttribute,
  onSubmitEditDz,
  onClickFinish,
}: FormModalEndActionsProps) => {
  const { formatMessage } = useIntl();
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmType | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      if (deleteConfirm === 'contentType') {
        await deleteContentType();
      } else if (deleteConfirm === 'component') {
        await deleteComponent();
      } else if (deleteConfirm === 'category' && categoryName) {
        await deleteCategory(categoryName);
      }
    } catch (err) {
      throw err;
    } finally {
      if (isMountedRef.current) {
        setDeleteConfirm(null);
      }
    }
  };

  const deleteConfirmMessage =
    deleteConfirm === 'contentType'
      ? '您确定要删除此 Content Type 吗'
      : deleteConfirm === 'component'
        ? formatMessage({
            id: getTrad('popUpWarning.bodyMessage.component.delete'),
            defaultMessage: 'Are you sure you want to delete this component?',
          })
        : deleteConfirm === 'category'
          ? formatMessage({
              id: getTrad('popUpWarning.bodyMessage.category.delete'),
              defaultMessage:
                'Are you sure you want to delete this category? All the components will also be deleted.',
            })
          : '';

  if (isComponentToDzModal) {
    if (isCreatingComponentInDz) {
      return (
        <ModalActionView
          variant="secondary"
          type="submit"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onSubmitAddComponentToDz(e, true);
          }}
          icon={<Plus />}
        >
          {formatMessage({
            id: getTrad('form.button.add-first-field-to-created-component'),
            defaultMessage: 'Add first field to the component',
          })}
        </ModalActionView>
      );
    }

    return (
      <ModalActionView
        variant="primary"
        type="submit"
        onClick={(e: SyntheticEvent) => {
          e.preventDefault();
          onSubmitAddComponentToDz(e, false);
        }}
      >
        {formatMessage({
          id: 'global.finish',
          defaultMessage: 'Finish',
        })}
      </ModalActionView>
    );
  }

  if (isAttributeModal && isDzAttribute && !isCreatingDz) {
    return (
      <ModalActionView
        variant="primary"
        type="submit"
        onClick={(e: SyntheticEvent) => {
          e.preventDefault();
          onClickFinish();
          onSubmitEditDz(e, false);
        }}
      >
        {formatMessage({
          id: 'global.finish',
          defaultMessage: 'Finish',
        })}
      </ModalActionView>
    );
  }

  if (isAttributeModal && isDzAttribute && isCreatingDz) {
    return (
      <>
        <ModalActionView
          variant="secondary"
          type="submit"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onSubmitCreateDz(e, true);
          }}
          icon={<Plus />}
        >
          {formatMessage({
            id: getTrad('form.button.add-components-to-dynamiczone'),
            defaultMessage: 'Add components to the zone',
          })}
        </ModalActionView>
        {/* // TO FIX fix doesnt close the modal */}
        {/* <Button
          variant="default"
          type="button"
          onClick={e => {
            e.preventDefault();

            onSubmitCreateDz(e, false);
          }}
        >
          {formatMessage({
            id: 'global.finish',
            defaultMessage: 'Finish',
          })}
        </Button> */}
      </>
    );
  }

  if (isAttributeModal && isComponentAttribute) {
    if (isInFirstComponentStep) {
      return (
        <ModalActionView
          variant="secondary"
          type="submit"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onSubmitAddComponentAttribute(e, true);
          }}
        >
          {isCreatingComponentAttribute
            ? formatMessage({
                id: getTrad('form.button.configure-component'),
                defaultMessage: 'Configure the component',
              })
            : formatMessage({
                id: getTrad('form.button.select-component'),
                defaultMessage: 'Configure the component',
              })}
        </ModalActionView>
      );
    }

    return (
      <Flex gap={3}>
        <ModalActionView
          variant="secondary"
          type="submit"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onSubmitAddComponentAttribute(e, true);
          }}
          icon={<Plus />}
        >
          {isCreatingComponentWhileAddingAField
            ? formatMessage({
                id: getTrad('form.button.add-first-field-to-created-component'),
                defaultMessage: 'Add first field to the component',
              })
            : formatMessage({
                id: getTrad('form.button.add-field'),
                defaultMessage: 'Add another field',
              })}
        </ModalActionView>
        <ModalActionView
          variant="primary"
          type="button"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onClickFinish();
            onSubmitAddComponentAttribute(e, false);
          }}
        >
          {formatMessage({
            id: 'global.finish',
            defaultMessage: 'Finish',
          })}
        </ModalActionView>
      </Flex>
    );
  }

  if (isAttributeModal && !isComponentAttribute && !isDzAttribute) {
    return (
      <Flex gap={3}>
        <ModalActionView
          type={isEditingAttribute ? 'button' : 'submit'}
          variant="secondary"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onSubmitEditAttribute(e, true);
          }}
          icon={<Plus />}
        >
          {formatMessage({
            id: getTrad('form.button.add-field'),
            defaultMessage: 'Add another field',
          })}
        </ModalActionView>
        <ModalActionView
          type={isEditingAttribute ? 'submit' : 'button'}
          variant="primary"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onClickFinish();
            onSubmitEditAttribute(e, false);
          }}
        >
          {formatMessage({
            id: 'global.finish',
            defaultMessage: 'Finish',
          })}
        </ModalActionView>
      </Flex>
    );
  }

  if (isContentTypeModal) {
    return (
      <>
        <Flex gap={3}>
          {!isCreatingContentType && (
            <>
              <ModalActionView
                type="button"
                variant="danger"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setDeleteConfirm('contentType');
                }}
              >
                {formatMessage({
                  id: 'global.delete',
                  defaultMessage: 'Delete',
                })}
              </ModalActionView>
              <ModalActionView
                type="submit"
                variant="primary"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  onSubmitEditContentType(e, false);
                }}
              >
                {formatMessage({
                  id: 'global.finish',
                  defaultMessage: 'Finish',
                })}
              </ModalActionView>
            </>
          )}
          {isCreatingContentType && (
            <ModalActionView
              type="submit"
              variant="secondary"
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                onSubmitCreateContentType(e, true);
              }}
            >
              {formatMessage({
                id: 'global.continue',
                defaultMessage: 'Continue',
              })}
            </ModalActionView>
          )}
        </Flex>
        <Dialog.Root open={deleteConfirm === 'contentType'} onOpenChange={(open: boolean) => !open && setDeleteConfirm(null)}>
          <ConfirmDialog onConfirm={handleDeleteConfirm} onCancel={() => setDeleteConfirm(null)}>
            {deleteConfirmMessage}
          </ConfirmDialog>
        </Dialog.Root>
      </>
    );
  }

  if (isComponentModal) {
    return (
      <>
        <Flex gap={3}>
          {!isCreatingComponent && (
            <>
              <ModalActionView
                type="button"
                variant="danger"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setDeleteConfirm('component');
                }}
              >
                {formatMessage({
                  id: 'global.delete',
                  defaultMessage: 'Delete',
                })}
              </ModalActionView>
              <ModalActionView
                type="submit"
                variant="primary"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  onSubmitEditComponent(e, false);
                }}
              >
                {formatMessage({
                  id: 'global.finish',
                  defaultMessage: 'Finish',
                })}
              </ModalActionView>
            </>
          )}
          {isCreatingComponent && (
            <ModalActionView
              type="submit"
              variant="secondary"
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                onSubmitCreateComponent(e, true);
              }}
            >
              {formatMessage({
                id: 'global.continue',
                defaultMessage: 'Continue',
              })}
            </ModalActionView>
          )}
        </Flex>
        <Dialog.Root open={deleteConfirm === 'component'} onOpenChange={(open: boolean) => !open && setDeleteConfirm(null)}>
          <ConfirmDialog onConfirm={handleDeleteConfirm} onCancel={() => setDeleteConfirm(null)}>
            {deleteConfirmMessage}
          </ConfirmDialog>
        </Dialog.Root>
      </>
    );
  }

  if (isEditingCategory) {
    return (
      <>
        <Flex gap={3}>
          <ModalActionView
            type="button"
            variant="danger"
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              if (categoryName) {
                setDeleteConfirm('category');
              }
            }}
          >
            {formatMessage({
              id: 'global.delete',
              defaultMessage: 'Delete',
            })}
          </ModalActionView>
          <ModalActionView
            type="submit"
            variant="primary"
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              onSubmitEditCategory(e);
            }}
          >
            {formatMessage({
              id: 'global.finish',
              defaultMessage: 'Finish',
            })}
          </ModalActionView>
        </Flex>
        <Dialog.Root open={deleteConfirm === 'category'} onOpenChange={(open: boolean) => !open && setDeleteConfirm(null)}>
          <ConfirmDialog onConfirm={handleDeleteConfirm} onCancel={() => setDeleteConfirm(null)}>
            {deleteConfirmMessage}
          </ConfirmDialog>
        </Dialog.Root>
      </>
    );
  }

  if (isCustomFieldModal) {
    return (
      <Flex gap={3}>
        <ModalActionView
          type={isEditingAttribute ? 'button' : 'submit'}
          variant="secondary"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onSubmitEditCustomFieldAttribute(e, true);
          }}
          icon={<Plus />}
        >
          {formatMessage({
            id: getTrad('form.button.add-field'),
            defaultMessage: 'Add another field',
          })}
        </ModalActionView>
        <ModalActionView
          type={isEditingAttribute ? 'submit' : 'button'}
          variant="primary"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            onClickFinish();
            onSubmitEditCustomFieldAttribute(e, false);
          }}
        >
          {formatMessage({
            id: 'global.finish',
            defaultMessage: 'Finish',
          })}
        </ModalActionView>
      </Flex>
    );
  }

  return null;
};
