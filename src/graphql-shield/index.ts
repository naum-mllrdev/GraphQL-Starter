import { shield, allow, deny, and, IRules } from 'graphql-shield';
import { isAuthenticated, yupRule, can } from './rules';
import { loginSchema, registerSchema, cursorArgsSchema } from './yup-validation-schemas';
import { GQL_Resolvers, StitchingResolver } from 'graphql-resolvers';
import { updateOwnerSchema } from './yup-validation-schemas/update-owner.schema';
import { createOwnerSchema } from './yup-validation-schemas/create-owner.schema';
import { deleteOwnerSchema } from './yup-validation-schemas/delete-owner.schema';
import { createPetSchema } from './yup-validation-schemas/create-pet.schema';
import { updatePetSchema } from './yup-validation-schemas/update-pet.schema';
import { deletePetSchema } from './yup-validation-schemas/delete-pet.schema';

/**
 * Read more about `GraphQL Shield` if this doesn't make sense to you.
 *
 * Currently using `Per Type Wildcard Rule` (https://github.com/maticzav/graphql-shield#per-type-wildcard-rule)
 * as using `fallbackRule` would catch all types. (https://github.com/maticzav/graphql-shield/issues/298#issuecomment-464660843)
 * Since our mutation responses are wrapped in an `<x>Payload` type,
 * it'll keep on throwing errors unless we specify all `<x>Payload` types below.
 *
 */
const rules: ShieldRuleTree = {
  Query: {
    '*': allow,
    _dummy: allow,
    _sampleDateTimeScalar: allow,
    _sampleDateScalar: allow,
    _sampleTimeScalar: allow,
    _authorizedOnlyQuery: allow,
    users: and(isAuthenticated, yupRule(cursorArgsSchema), can('read', 'User')),
    owners: and(yupRule(cursorArgsSchema)),
    pets: and(yupRule(cursorArgsSchema)),
  },
  Mutation: {
    '*': allow,
    _dummy: allow,
    login: yupRule(loginSchema),
    logout: allow,
    register: yupRule(registerSchema),
    createOwner: yupRule(createOwnerSchema),
    updateOwner: yupRule(updateOwnerSchema),
    deleteOwner: yupRule(deleteOwnerSchema),
    createPet: yupRule(createPetSchema),
    updatePet: yupRule(updatePetSchema),
    deletePet: yupRule(deletePetSchema),
  },
  Subscription: {
    '*': isAuthenticated,
    _dummy: allow,
  },
};

export const schemaPermissions = shield(rules as IRules, {
  /**
   * Enable this property so your custom errors get exposed.
   * This is `false` by default and GraphQL Shield just sets
   * the `message` into "Not authorised!" for errors thrown.
   */
  allowExternalErrors: true,
});

/**
 * Do not touch unless you know what you're doing.
 * Currently, GraphQL-Shield does not provide a way to
 * let us provide types for the 'ruleTree' from the shield()
 * middleware so this is an attempt to provide type safety
 * for the meantime.
 *
 * TODO:
 * Improve types as the current typedef yields an extra
 * empty object "{}" type probably due to a distributive
 * conditional somewhere.
 */
type WildcardRule = { '*': IRules };
type GraphQLShieldRule = IRules | WildcardRule;
type ModifyShapeType<S> = S extends {}
  ? {
      // tslint:disable-next-line: no-any
      [k in keyof S]: ModifyShapeType<Exclude<S[k], StitchingResolver<any, any, any, any>>>;
    }
  : GraphQLShieldRule;
type ShieldRuleTree = ModifyShapeType<GQL_Resolvers>;
