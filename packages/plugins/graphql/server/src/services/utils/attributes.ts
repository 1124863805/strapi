import { propEq } from 'lodash/fp';
import type { Schema } from '@leao1/types';
import type { Context } from '../types';

export default ({ leao }: Context) => {
  /**
   * Check if the given attribute is a Leao scalar
   * @param {object} attribute
   * @return {boolean}
   */
  const isLeaoScalar = (attribute: Schema.Attribute.AnyAttribute) => {
    return leao.plugin('graphql').service('constants').LEAO_SCALARS.includes(attribute.type);
  };

  /**
   * Check if the given attribute is a GraphQL scalar
   * @param {object} attribute
   * @return {boolean}
   */
  const isGraphQLScalar = (attribute: Schema.Attribute.AnyAttribute) => {
    return leao.plugin('graphql').service('constants').GRAPHQL_SCALARS.includes(attribute.type);
  };

  /**
   * Check if the given attribute is a polymorphic relation
   * @param {object} attribute
   * @return {boolean}
   */
  const isMorphRelation = (attribute: Schema.Attribute.AnyAttribute) => {
    return attribute.type === 'relation' && attribute.relation.includes('morph');
  };

  /**
   * Check if the given attribute is a media
   * @param {object} attribute
   * @return {boolean}
   */
  const isMedia = propEq('type', 'media');

  /**
   * Check if the given attribute is a relation
   * @param {object} attribute
   * @return {boolean}
   */
  const isRelation = propEq('type', 'relation');

  /**
   * Check if the given attribute is an enum
   * @param {object} attribute
   * @return {boolean}
   */
  const isEnumeration = propEq('type', 'enumeration');

  /**
   * Check if the given attribute is a component
   * @param {object} attribute
   * @return {boolean}
   */
  const isComponent = propEq('type', 'component');

  /**
   * Check if the given attribute is a dynamic zone
   * @param {object} attribute
   * @return {boolean}
   */
  const isDynamicZone = propEq('type', 'dynamiczone');

  return {
    isLeaoScalar,
    isGraphQLScalar,
    isMorphRelation,
    isMedia,
    isRelation,
    isEnumeration,
    isComponent,
    isDynamicZone,
  };
};
