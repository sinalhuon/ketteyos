
/**
 * Client
**/

import * as runtime from '@prisma/client/runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Guest
 * 
 */
export type Guest = $Result.DefaultSelection<Prisma.$GuestPayload>
/**
 * Model AlbumPhoto
 * 
 */
export type AlbumPhoto = $Result.DefaultSelection<Prisma.$AlbumPhotoPayload>
/**
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>
/**
 * Model GlobalAsset
 * 
 */
export type GlobalAsset = $Result.DefaultSelection<Prisma.$GlobalAssetPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs>;

  /**
   * `prisma.guest`: Exposes CRUD operations for the **Guest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guests
    * const guests = await prisma.guest.findMany()
    * ```
    */
  get guest(): Prisma.GuestDelegate<ExtArgs>;

  /**
   * `prisma.albumPhoto`: Exposes CRUD operations for the **AlbumPhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlbumPhotos
    * const albumPhotos = await prisma.albumPhoto.findMany()
    * ```
    */
  get albumPhoto(): Prisma.AlbumPhotoDelegate<ExtArgs>;

  /**
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs>;

  /**
   * `prisma.globalAsset`: Exposes CRUD operations for the **GlobalAsset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GlobalAssets
    * const globalAssets = await prisma.globalAsset.findMany()
    * ```
    */
  get globalAsset(): Prisma.GlobalAssetDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Event: 'Event',
    Guest: 'Guest',
    AlbumPhoto: 'AlbumPhoto',
    Template: 'Template',
    GlobalAsset: 'GlobalAsset'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "event" | "guest" | "albumPhoto" | "template" | "globalAsset"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Guest: {
        payload: Prisma.$GuestPayload<ExtArgs>
        fields: Prisma.GuestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          findFirst: {
            args: Prisma.GuestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          findMany: {
            args: Prisma.GuestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>[]
          }
          create: {
            args: Prisma.GuestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          createMany: {
            args: Prisma.GuestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GuestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          update: {
            args: Prisma.GuestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          deleteMany: {
            args: Prisma.GuestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GuestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          aggregate: {
            args: Prisma.GuestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuest>
          }
          groupBy: {
            args: Prisma.GuestGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestCountArgs<ExtArgs>
            result: $Utils.Optional<GuestCountAggregateOutputType> | number
          }
        }
      }
      AlbumPhoto: {
        payload: Prisma.$AlbumPhotoPayload<ExtArgs>
        fields: Prisma.AlbumPhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlbumPhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlbumPhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          findFirst: {
            args: Prisma.AlbumPhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlbumPhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          findMany: {
            args: Prisma.AlbumPhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>[]
          }
          create: {
            args: Prisma.AlbumPhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          createMany: {
            args: Prisma.AlbumPhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AlbumPhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          update: {
            args: Prisma.AlbumPhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          deleteMany: {
            args: Prisma.AlbumPhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlbumPhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlbumPhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          aggregate: {
            args: Prisma.AlbumPhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlbumPhoto>
          }
          groupBy: {
            args: Prisma.AlbumPhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlbumPhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlbumPhotoCountArgs<ExtArgs>
            result: $Utils.Optional<AlbumPhotoCountAggregateOutputType> | number
          }
        }
      }
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
      GlobalAsset: {
        payload: Prisma.$GlobalAssetPayload<ExtArgs>
        fields: Prisma.GlobalAssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GlobalAssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GlobalAssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>
          }
          findFirst: {
            args: Prisma.GlobalAssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GlobalAssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>
          }
          findMany: {
            args: Prisma.GlobalAssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>[]
          }
          create: {
            args: Prisma.GlobalAssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>
          }
          createMany: {
            args: Prisma.GlobalAssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GlobalAssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>
          }
          update: {
            args: Prisma.GlobalAssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>
          }
          deleteMany: {
            args: Prisma.GlobalAssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GlobalAssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GlobalAssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalAssetPayload>
          }
          aggregate: {
            args: Prisma.GlobalAssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGlobalAsset>
          }
          groupBy: {
            args: Prisma.GlobalAssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<GlobalAssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.GlobalAssetCountArgs<ExtArgs>
            result: $Utils.Optional<GlobalAssetCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    events: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | UserCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    guests: number
    albumPhotos: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guests?: boolean | EventCountOutputTypeCountGuestsArgs
    albumPhotos?: boolean | EventCountOutputTypeCountAlbumPhotosArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountGuestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountAlbumPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumPhotoWhereInput
  }


  /**
   * Count Type TemplateCountOutputType
   */

  export type TemplateCountOutputType = {
    events: number
  }

  export type TemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | TemplateCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * TemplateCountOutputType without action
   */
  export type TemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateCountOutputType
     */
    select?: TemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TemplateCountOutputType without action
   */
  export type TemplateCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string | null
    role: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    events?: boolean | User$eventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>


  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | User$eventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string | null
      role: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends User$eventsArgs<ExtArgs> = {}>(args?: Subset<T, User$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.events
   */
  export type User$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    logoSize: number | null
  }

  export type EventSumAggregateOutputType = {
    logoSize: number | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    date: Date | null
    location: string | null
    description: string | null
    eventType: string | null
    templateId: string | null
    musicUrl: string | null
    logoUrl: string | null
    logoSize: number | null
    groomFatherName: string | null
    groomMotherName: string | null
    brideFatherName: string | null
    brideMotherName: string | null
    groomFirstName: string | null
    groomLastName: string | null
    brideFirstName: string | null
    brideLastName: string | null
    invitationMessage: string | null
    eventTime: string | null
    venueDetails: string | null
    mapUrl: string | null
    startDate: Date | null
    endDate: Date | null
    eventDays: string | null
    schedule: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    date: Date | null
    location: string | null
    description: string | null
    eventType: string | null
    templateId: string | null
    musicUrl: string | null
    logoUrl: string | null
    logoSize: number | null
    groomFatherName: string | null
    groomMotherName: string | null
    brideFatherName: string | null
    brideMotherName: string | null
    groomFirstName: string | null
    groomLastName: string | null
    brideFirstName: string | null
    brideLastName: string | null
    invitationMessage: string | null
    eventTime: string | null
    venueDetails: string | null
    mapUrl: string | null
    startDate: Date | null
    endDate: Date | null
    eventDays: string | null
    schedule: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    date: number
    location: number
    description: number
    eventType: number
    templateId: number
    musicUrl: number
    logoUrl: number
    logoSize: number
    groomFatherName: number
    groomMotherName: number
    brideFatherName: number
    brideMotherName: number
    groomFirstName: number
    groomLastName: number
    brideFirstName: number
    brideLastName: number
    invitationMessage: number
    eventTime: number
    venueDetails: number
    mapUrl: number
    startDate: number
    endDate: number
    eventDays: number
    schedule: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    logoSize?: true
  }

  export type EventSumAggregateInputType = {
    logoSize?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    date?: true
    location?: true
    description?: true
    eventType?: true
    templateId?: true
    musicUrl?: true
    logoUrl?: true
    logoSize?: true
    groomFatherName?: true
    groomMotherName?: true
    brideFatherName?: true
    brideMotherName?: true
    groomFirstName?: true
    groomLastName?: true
    brideFirstName?: true
    brideLastName?: true
    invitationMessage?: true
    eventTime?: true
    venueDetails?: true
    mapUrl?: true
    startDate?: true
    endDate?: true
    eventDays?: true
    schedule?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    date?: true
    location?: true
    description?: true
    eventType?: true
    templateId?: true
    musicUrl?: true
    logoUrl?: true
    logoSize?: true
    groomFatherName?: true
    groomMotherName?: true
    brideFatherName?: true
    brideMotherName?: true
    groomFirstName?: true
    groomLastName?: true
    brideFirstName?: true
    brideLastName?: true
    invitationMessage?: true
    eventTime?: true
    venueDetails?: true
    mapUrl?: true
    startDate?: true
    endDate?: true
    eventDays?: true
    schedule?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    date?: true
    location?: true
    description?: true
    eventType?: true
    templateId?: true
    musicUrl?: true
    logoUrl?: true
    logoSize?: true
    groomFatherName?: true
    groomMotherName?: true
    brideFatherName?: true
    brideMotherName?: true
    groomFirstName?: true
    groomLastName?: true
    brideFirstName?: true
    brideLastName?: true
    invitationMessage?: true
    eventTime?: true
    venueDetails?: true
    mapUrl?: true
    startDate?: true
    endDate?: true
    eventDays?: true
    schedule?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    title: string
    slug: string | null
    date: Date
    location: string
    description: string | null
    eventType: string
    templateId: string
    musicUrl: string | null
    logoUrl: string | null
    logoSize: number
    groomFatherName: string | null
    groomMotherName: string | null
    brideFatherName: string | null
    brideMotherName: string | null
    groomFirstName: string | null
    groomLastName: string | null
    brideFirstName: string | null
    brideLastName: string | null
    invitationMessage: string | null
    eventTime: string | null
    venueDetails: string | null
    mapUrl: string | null
    startDate: Date
    endDate: Date | null
    eventDays: string | null
    schedule: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    date?: boolean
    location?: boolean
    description?: boolean
    eventType?: boolean
    templateId?: boolean
    musicUrl?: boolean
    logoUrl?: boolean
    logoSize?: boolean
    groomFatherName?: boolean
    groomMotherName?: boolean
    brideFatherName?: boolean
    brideMotherName?: boolean
    groomFirstName?: boolean
    groomLastName?: boolean
    brideFirstName?: boolean
    brideLastName?: boolean
    invitationMessage?: boolean
    eventTime?: boolean
    venueDetails?: boolean
    mapUrl?: boolean
    startDate?: boolean
    endDate?: boolean
    eventDays?: boolean
    schedule?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    template?: boolean | TemplateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    guests?: boolean | Event$guestsArgs<ExtArgs>
    albumPhotos?: boolean | Event$albumPhotosArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>


  export type EventSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    date?: boolean
    location?: boolean
    description?: boolean
    eventType?: boolean
    templateId?: boolean
    musicUrl?: boolean
    logoUrl?: boolean
    logoSize?: boolean
    groomFatherName?: boolean
    groomMotherName?: boolean
    brideFatherName?: boolean
    brideMotherName?: boolean
    groomFirstName?: boolean
    groomLastName?: boolean
    brideFirstName?: boolean
    brideLastName?: boolean
    invitationMessage?: boolean
    eventTime?: boolean
    venueDetails?: boolean
    mapUrl?: boolean
    startDate?: boolean
    endDate?: boolean
    eventDays?: boolean
    schedule?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TemplateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    guests?: boolean | Event$guestsArgs<ExtArgs>
    albumPhotos?: boolean | Event$albumPhotosArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      template: Prisma.$TemplatePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      guests: Prisma.$GuestPayload<ExtArgs>[]
      albumPhotos: Prisma.$AlbumPhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string | null
      date: Date
      location: string
      description: string | null
      eventType: string
      templateId: string
      musicUrl: string | null
      logoUrl: string | null
      logoSize: number
      groomFatherName: string | null
      groomMotherName: string | null
      brideFatherName: string | null
      brideMotherName: string | null
      groomFirstName: string | null
      groomLastName: string | null
      brideFirstName: string | null
      brideLastName: string | null
      invitationMessage: string | null
      eventTime: string | null
      venueDetails: string | null
      mapUrl: string | null
      startDate: Date
      endDate: Date | null
      eventDays: string | null
      schedule: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends TemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TemplateDefaultArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    guests<T extends Event$guestsArgs<ExtArgs> = {}>(args?: Subset<T, Event$guestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findMany"> | Null>
    albumPhotos<T extends Event$albumPhotosArgs<ExtArgs> = {}>(args?: Subset<T, Event$albumPhotosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */ 
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly title: FieldRef<"Event", 'String'>
    readonly slug: FieldRef<"Event", 'String'>
    readonly date: FieldRef<"Event", 'DateTime'>
    readonly location: FieldRef<"Event", 'String'>
    readonly description: FieldRef<"Event", 'String'>
    readonly eventType: FieldRef<"Event", 'String'>
    readonly templateId: FieldRef<"Event", 'String'>
    readonly musicUrl: FieldRef<"Event", 'String'>
    readonly logoUrl: FieldRef<"Event", 'String'>
    readonly logoSize: FieldRef<"Event", 'Int'>
    readonly groomFatherName: FieldRef<"Event", 'String'>
    readonly groomMotherName: FieldRef<"Event", 'String'>
    readonly brideFatherName: FieldRef<"Event", 'String'>
    readonly brideMotherName: FieldRef<"Event", 'String'>
    readonly groomFirstName: FieldRef<"Event", 'String'>
    readonly groomLastName: FieldRef<"Event", 'String'>
    readonly brideFirstName: FieldRef<"Event", 'String'>
    readonly brideLastName: FieldRef<"Event", 'String'>
    readonly invitationMessage: FieldRef<"Event", 'String'>
    readonly eventTime: FieldRef<"Event", 'String'>
    readonly venueDetails: FieldRef<"Event", 'String'>
    readonly mapUrl: FieldRef<"Event", 'String'>
    readonly startDate: FieldRef<"Event", 'DateTime'>
    readonly endDate: FieldRef<"Event", 'DateTime'>
    readonly eventDays: FieldRef<"Event", 'String'>
    readonly schedule: FieldRef<"Event", 'String'>
    readonly userId: FieldRef<"Event", 'String'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
  }

  /**
   * Event.guests
   */
  export type Event$guestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    where?: GuestWhereInput
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    cursor?: GuestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Event.albumPhotos
   */
  export type Event$albumPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    where?: AlbumPhotoWhereInput
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    cursor?: AlbumPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Guest
   */

  export type AggregateGuest = {
    _count: GuestCountAggregateOutputType | null
    _min: GuestMinAggregateOutputType | null
    _max: GuestMaxAggregateOutputType | null
  }

  export type GuestMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    shortCode: string | null
    token: string | null
    status: string | null
    eventId: string | null
    phoneNumber: string | null
  }

  export type GuestMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    shortCode: string | null
    token: string | null
    status: string | null
    eventId: string | null
    phoneNumber: string | null
  }

  export type GuestCountAggregateOutputType = {
    id: number
    name: number
    email: number
    shortCode: number
    token: number
    status: number
    eventId: number
    phoneNumber: number
    _all: number
  }


  export type GuestMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    shortCode?: true
    token?: true
    status?: true
    eventId?: true
    phoneNumber?: true
  }

  export type GuestMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    shortCode?: true
    token?: true
    status?: true
    eventId?: true
    phoneNumber?: true
  }

  export type GuestCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    shortCode?: true
    token?: true
    status?: true
    eventId?: true
    phoneNumber?: true
    _all?: true
  }

  export type GuestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guest to aggregate.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guests
    **/
    _count?: true | GuestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestMaxAggregateInputType
  }

  export type GetGuestAggregateType<T extends GuestAggregateArgs> = {
        [P in keyof T & keyof AggregateGuest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuest[P]>
      : GetScalarType<T[P], AggregateGuest[P]>
  }




  export type GuestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestWhereInput
    orderBy?: GuestOrderByWithAggregationInput | GuestOrderByWithAggregationInput[]
    by: GuestScalarFieldEnum[] | GuestScalarFieldEnum
    having?: GuestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestCountAggregateInputType | true
    _min?: GuestMinAggregateInputType
    _max?: GuestMaxAggregateInputType
  }

  export type GuestGroupByOutputType = {
    id: string
    name: string
    email: string | null
    shortCode: string | null
    token: string
    status: string
    eventId: string
    phoneNumber: string | null
    _count: GuestCountAggregateOutputType | null
    _min: GuestMinAggregateOutputType | null
    _max: GuestMaxAggregateOutputType | null
  }

  type GetGuestGroupByPayload<T extends GuestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestGroupByOutputType[P]>
            : GetScalarType<T[P], GuestGroupByOutputType[P]>
        }
      >
    >


  export type GuestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    shortCode?: boolean
    token?: boolean
    status?: boolean
    eventId?: boolean
    phoneNumber?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guest"]>


  export type GuestSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    shortCode?: boolean
    token?: boolean
    status?: boolean
    eventId?: boolean
    phoneNumber?: boolean
  }

  export type GuestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $GuestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Guest"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string | null
      shortCode: string | null
      token: string
      status: string
      eventId: string
      phoneNumber: string | null
    }, ExtArgs["result"]["guest"]>
    composites: {}
  }

  type GuestGetPayload<S extends boolean | null | undefined | GuestDefaultArgs> = $Result.GetResult<Prisma.$GuestPayload, S>

  type GuestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GuestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GuestCountAggregateInputType | true
    }

  export interface GuestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Guest'], meta: { name: 'Guest' } }
    /**
     * Find zero or one Guest that matches the filter.
     * @param {GuestFindUniqueArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestFindUniqueArgs>(args: SelectSubset<T, GuestFindUniqueArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Guest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GuestFindUniqueOrThrowArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Guest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestFindFirstArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestFindFirstArgs>(args?: SelectSubset<T, GuestFindFirstArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Guest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestFindFirstOrThrowArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Guests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guests
     * const guests = await prisma.guest.findMany()
     * 
     * // Get first 10 Guests
     * const guests = await prisma.guest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestWithIdOnly = await prisma.guest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestFindManyArgs>(args?: SelectSubset<T, GuestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Guest.
     * @param {GuestCreateArgs} args - Arguments to create a Guest.
     * @example
     * // Create one Guest
     * const Guest = await prisma.guest.create({
     *   data: {
     *     // ... data to create a Guest
     *   }
     * })
     * 
     */
    create<T extends GuestCreateArgs>(args: SelectSubset<T, GuestCreateArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Guests.
     * @param {GuestCreateManyArgs} args - Arguments to create many Guests.
     * @example
     * // Create many Guests
     * const guest = await prisma.guest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestCreateManyArgs>(args?: SelectSubset<T, GuestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Guest.
     * @param {GuestDeleteArgs} args - Arguments to delete one Guest.
     * @example
     * // Delete one Guest
     * const Guest = await prisma.guest.delete({
     *   where: {
     *     // ... filter to delete one Guest
     *   }
     * })
     * 
     */
    delete<T extends GuestDeleteArgs>(args: SelectSubset<T, GuestDeleteArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Guest.
     * @param {GuestUpdateArgs} args - Arguments to update one Guest.
     * @example
     * // Update one Guest
     * const guest = await prisma.guest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestUpdateArgs>(args: SelectSubset<T, GuestUpdateArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Guests.
     * @param {GuestDeleteManyArgs} args - Arguments to filter Guests to delete.
     * @example
     * // Delete a few Guests
     * const { count } = await prisma.guest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestDeleteManyArgs>(args?: SelectSubset<T, GuestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guests
     * const guest = await prisma.guest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestUpdateManyArgs>(args: SelectSubset<T, GuestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Guest.
     * @param {GuestUpsertArgs} args - Arguments to update or create a Guest.
     * @example
     * // Update or create a Guest
     * const guest = await prisma.guest.upsert({
     *   create: {
     *     // ... data to create a Guest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guest we want to update
     *   }
     * })
     */
    upsert<T extends GuestUpsertArgs>(args: SelectSubset<T, GuestUpsertArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Guests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestCountArgs} args - Arguments to filter Guests to count.
     * @example
     * // Count the number of Guests
     * const count = await prisma.guest.count({
     *   where: {
     *     // ... the filter for the Guests we want to count
     *   }
     * })
    **/
    count<T extends GuestCountArgs>(
      args?: Subset<T, GuestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuestAggregateArgs>(args: Subset<T, GuestAggregateArgs>): Prisma.PrismaPromise<GetGuestAggregateType<T>>

    /**
     * Group by Guest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestGroupByArgs['orderBy'] }
        : { orderBy?: GuestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Guest model
   */
  readonly fields: GuestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Guest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Guest model
   */ 
  interface GuestFieldRefs {
    readonly id: FieldRef<"Guest", 'String'>
    readonly name: FieldRef<"Guest", 'String'>
    readonly email: FieldRef<"Guest", 'String'>
    readonly shortCode: FieldRef<"Guest", 'String'>
    readonly token: FieldRef<"Guest", 'String'>
    readonly status: FieldRef<"Guest", 'String'>
    readonly eventId: FieldRef<"Guest", 'String'>
    readonly phoneNumber: FieldRef<"Guest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Guest findUnique
   */
  export type GuestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest findUniqueOrThrow
   */
  export type GuestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest findFirst
   */
  export type GuestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guests.
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guests.
     */
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Guest findFirstOrThrow
   */
  export type GuestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guests.
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guests.
     */
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Guest findMany
   */
  export type GuestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guests to fetch.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guests.
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Guest create
   */
  export type GuestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * The data needed to create a Guest.
     */
    data: XOR<GuestCreateInput, GuestUncheckedCreateInput>
  }

  /**
   * Guest createMany
   */
  export type GuestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Guests.
     */
    data: GuestCreateManyInput | GuestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guest update
   */
  export type GuestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * The data needed to update a Guest.
     */
    data: XOR<GuestUpdateInput, GuestUncheckedUpdateInput>
    /**
     * Choose, which Guest to update.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest updateMany
   */
  export type GuestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Guests.
     */
    data: XOR<GuestUpdateManyMutationInput, GuestUncheckedUpdateManyInput>
    /**
     * Filter which Guests to update
     */
    where?: GuestWhereInput
  }

  /**
   * Guest upsert
   */
  export type GuestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * The filter to search for the Guest to update in case it exists.
     */
    where: GuestWhereUniqueInput
    /**
     * In case the Guest found by the `where` argument doesn't exist, create a new Guest with this data.
     */
    create: XOR<GuestCreateInput, GuestUncheckedCreateInput>
    /**
     * In case the Guest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestUpdateInput, GuestUncheckedUpdateInput>
  }

  /**
   * Guest delete
   */
  export type GuestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter which Guest to delete.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest deleteMany
   */
  export type GuestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guests to delete
     */
    where?: GuestWhereInput
  }

  /**
   * Guest without action
   */
  export type GuestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
  }


  /**
   * Model AlbumPhoto
   */

  export type AggregateAlbumPhoto = {
    _count: AlbumPhotoCountAggregateOutputType | null
    _avg: AlbumPhotoAvgAggregateOutputType | null
    _sum: AlbumPhotoSumAggregateOutputType | null
    _min: AlbumPhotoMinAggregateOutputType | null
    _max: AlbumPhotoMaxAggregateOutputType | null
  }

  export type AlbumPhotoAvgAggregateOutputType = {
    order: number | null
  }

  export type AlbumPhotoSumAggregateOutputType = {
    order: number | null
  }

  export type AlbumPhotoMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    imageUrl: string | null
    order: number | null
    createdAt: Date | null
  }

  export type AlbumPhotoMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    imageUrl: string | null
    order: number | null
    createdAt: Date | null
  }

  export type AlbumPhotoCountAggregateOutputType = {
    id: number
    eventId: number
    imageUrl: number
    order: number
    createdAt: number
    _all: number
  }


  export type AlbumPhotoAvgAggregateInputType = {
    order?: true
  }

  export type AlbumPhotoSumAggregateInputType = {
    order?: true
  }

  export type AlbumPhotoMinAggregateInputType = {
    id?: true
    eventId?: true
    imageUrl?: true
    order?: true
    createdAt?: true
  }

  export type AlbumPhotoMaxAggregateInputType = {
    id?: true
    eventId?: true
    imageUrl?: true
    order?: true
    createdAt?: true
  }

  export type AlbumPhotoCountAggregateInputType = {
    id?: true
    eventId?: true
    imageUrl?: true
    order?: true
    createdAt?: true
    _all?: true
  }

  export type AlbumPhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlbumPhoto to aggregate.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlbumPhotos
    **/
    _count?: true | AlbumPhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlbumPhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlbumPhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlbumPhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlbumPhotoMaxAggregateInputType
  }

  export type GetAlbumPhotoAggregateType<T extends AlbumPhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateAlbumPhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlbumPhoto[P]>
      : GetScalarType<T[P], AggregateAlbumPhoto[P]>
  }




  export type AlbumPhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumPhotoWhereInput
    orderBy?: AlbumPhotoOrderByWithAggregationInput | AlbumPhotoOrderByWithAggregationInput[]
    by: AlbumPhotoScalarFieldEnum[] | AlbumPhotoScalarFieldEnum
    having?: AlbumPhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlbumPhotoCountAggregateInputType | true
    _avg?: AlbumPhotoAvgAggregateInputType
    _sum?: AlbumPhotoSumAggregateInputType
    _min?: AlbumPhotoMinAggregateInputType
    _max?: AlbumPhotoMaxAggregateInputType
  }

  export type AlbumPhotoGroupByOutputType = {
    id: string
    eventId: string
    imageUrl: string
    order: number
    createdAt: Date
    _count: AlbumPhotoCountAggregateOutputType | null
    _avg: AlbumPhotoAvgAggregateOutputType | null
    _sum: AlbumPhotoSumAggregateOutputType | null
    _min: AlbumPhotoMinAggregateOutputType | null
    _max: AlbumPhotoMaxAggregateOutputType | null
  }

  type GetAlbumPhotoGroupByPayload<T extends AlbumPhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlbumPhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlbumPhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlbumPhotoGroupByOutputType[P]>
            : GetScalarType<T[P], AlbumPhotoGroupByOutputType[P]>
        }
      >
    >


  export type AlbumPhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    imageUrl?: boolean
    order?: boolean
    createdAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["albumPhoto"]>


  export type AlbumPhotoSelectScalar = {
    id?: boolean
    eventId?: boolean
    imageUrl?: boolean
    order?: boolean
    createdAt?: boolean
  }

  export type AlbumPhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $AlbumPhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlbumPhoto"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      imageUrl: string
      order: number
      createdAt: Date
    }, ExtArgs["result"]["albumPhoto"]>
    composites: {}
  }

  type AlbumPhotoGetPayload<S extends boolean | null | undefined | AlbumPhotoDefaultArgs> = $Result.GetResult<Prisma.$AlbumPhotoPayload, S>

  type AlbumPhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlbumPhotoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlbumPhotoCountAggregateInputType | true
    }

  export interface AlbumPhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlbumPhoto'], meta: { name: 'AlbumPhoto' } }
    /**
     * Find zero or one AlbumPhoto that matches the filter.
     * @param {AlbumPhotoFindUniqueArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlbumPhotoFindUniqueArgs>(args: SelectSubset<T, AlbumPhotoFindUniqueArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AlbumPhoto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlbumPhotoFindUniqueOrThrowArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlbumPhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, AlbumPhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AlbumPhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoFindFirstArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlbumPhotoFindFirstArgs>(args?: SelectSubset<T, AlbumPhotoFindFirstArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AlbumPhoto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoFindFirstOrThrowArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlbumPhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, AlbumPhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AlbumPhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlbumPhotos
     * const albumPhotos = await prisma.albumPhoto.findMany()
     * 
     * // Get first 10 AlbumPhotos
     * const albumPhotos = await prisma.albumPhoto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const albumPhotoWithIdOnly = await prisma.albumPhoto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlbumPhotoFindManyArgs>(args?: SelectSubset<T, AlbumPhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AlbumPhoto.
     * @param {AlbumPhotoCreateArgs} args - Arguments to create a AlbumPhoto.
     * @example
     * // Create one AlbumPhoto
     * const AlbumPhoto = await prisma.albumPhoto.create({
     *   data: {
     *     // ... data to create a AlbumPhoto
     *   }
     * })
     * 
     */
    create<T extends AlbumPhotoCreateArgs>(args: SelectSubset<T, AlbumPhotoCreateArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AlbumPhotos.
     * @param {AlbumPhotoCreateManyArgs} args - Arguments to create many AlbumPhotos.
     * @example
     * // Create many AlbumPhotos
     * const albumPhoto = await prisma.albumPhoto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlbumPhotoCreateManyArgs>(args?: SelectSubset<T, AlbumPhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AlbumPhoto.
     * @param {AlbumPhotoDeleteArgs} args - Arguments to delete one AlbumPhoto.
     * @example
     * // Delete one AlbumPhoto
     * const AlbumPhoto = await prisma.albumPhoto.delete({
     *   where: {
     *     // ... filter to delete one AlbumPhoto
     *   }
     * })
     * 
     */
    delete<T extends AlbumPhotoDeleteArgs>(args: SelectSubset<T, AlbumPhotoDeleteArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AlbumPhoto.
     * @param {AlbumPhotoUpdateArgs} args - Arguments to update one AlbumPhoto.
     * @example
     * // Update one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlbumPhotoUpdateArgs>(args: SelectSubset<T, AlbumPhotoUpdateArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AlbumPhotos.
     * @param {AlbumPhotoDeleteManyArgs} args - Arguments to filter AlbumPhotos to delete.
     * @example
     * // Delete a few AlbumPhotos
     * const { count } = await prisma.albumPhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlbumPhotoDeleteManyArgs>(args?: SelectSubset<T, AlbumPhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlbumPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlbumPhotos
     * const albumPhoto = await prisma.albumPhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlbumPhotoUpdateManyArgs>(args: SelectSubset<T, AlbumPhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlbumPhoto.
     * @param {AlbumPhotoUpsertArgs} args - Arguments to update or create a AlbumPhoto.
     * @example
     * // Update or create a AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.upsert({
     *   create: {
     *     // ... data to create a AlbumPhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlbumPhoto we want to update
     *   }
     * })
     */
    upsert<T extends AlbumPhotoUpsertArgs>(args: SelectSubset<T, AlbumPhotoUpsertArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AlbumPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoCountArgs} args - Arguments to filter AlbumPhotos to count.
     * @example
     * // Count the number of AlbumPhotos
     * const count = await prisma.albumPhoto.count({
     *   where: {
     *     // ... the filter for the AlbumPhotos we want to count
     *   }
     * })
    **/
    count<T extends AlbumPhotoCountArgs>(
      args?: Subset<T, AlbumPhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlbumPhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlbumPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlbumPhotoAggregateArgs>(args: Subset<T, AlbumPhotoAggregateArgs>): Prisma.PrismaPromise<GetAlbumPhotoAggregateType<T>>

    /**
     * Group by AlbumPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlbumPhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlbumPhotoGroupByArgs['orderBy'] }
        : { orderBy?: AlbumPhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlbumPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlbumPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlbumPhoto model
   */
  readonly fields: AlbumPhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlbumPhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlbumPhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AlbumPhoto model
   */ 
  interface AlbumPhotoFieldRefs {
    readonly id: FieldRef<"AlbumPhoto", 'String'>
    readonly eventId: FieldRef<"AlbumPhoto", 'String'>
    readonly imageUrl: FieldRef<"AlbumPhoto", 'String'>
    readonly order: FieldRef<"AlbumPhoto", 'Int'>
    readonly createdAt: FieldRef<"AlbumPhoto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlbumPhoto findUnique
   */
  export type AlbumPhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto findUniqueOrThrow
   */
  export type AlbumPhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto findFirst
   */
  export type AlbumPhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlbumPhotos.
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlbumPhotos.
     */
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * AlbumPhoto findFirstOrThrow
   */
  export type AlbumPhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlbumPhotos.
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlbumPhotos.
     */
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * AlbumPhoto findMany
   */
  export type AlbumPhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhotos to fetch.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlbumPhotos.
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * AlbumPhoto create
   */
  export type AlbumPhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a AlbumPhoto.
     */
    data: XOR<AlbumPhotoCreateInput, AlbumPhotoUncheckedCreateInput>
  }

  /**
   * AlbumPhoto createMany
   */
  export type AlbumPhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlbumPhotos.
     */
    data: AlbumPhotoCreateManyInput | AlbumPhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlbumPhoto update
   */
  export type AlbumPhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a AlbumPhoto.
     */
    data: XOR<AlbumPhotoUpdateInput, AlbumPhotoUncheckedUpdateInput>
    /**
     * Choose, which AlbumPhoto to update.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto updateMany
   */
  export type AlbumPhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlbumPhotos.
     */
    data: XOR<AlbumPhotoUpdateManyMutationInput, AlbumPhotoUncheckedUpdateManyInput>
    /**
     * Filter which AlbumPhotos to update
     */
    where?: AlbumPhotoWhereInput
  }

  /**
   * AlbumPhoto upsert
   */
  export type AlbumPhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the AlbumPhoto to update in case it exists.
     */
    where: AlbumPhotoWhereUniqueInput
    /**
     * In case the AlbumPhoto found by the `where` argument doesn't exist, create a new AlbumPhoto with this data.
     */
    create: XOR<AlbumPhotoCreateInput, AlbumPhotoUncheckedCreateInput>
    /**
     * In case the AlbumPhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlbumPhotoUpdateInput, AlbumPhotoUncheckedUpdateInput>
  }

  /**
   * AlbumPhoto delete
   */
  export type AlbumPhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter which AlbumPhoto to delete.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto deleteMany
   */
  export type AlbumPhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlbumPhotos to delete
     */
    where?: AlbumPhotoWhereInput
  }

  /**
   * AlbumPhoto without action
   */
  export type AlbumPhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
  }


  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    previewUrl: string | null
    codeKey: string | null
    category: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    previewUrl: string | null
    codeKey: string | null
    category: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    name: number
    description: number
    previewUrl: number
    codeKey: number
    category: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type TemplateMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    previewUrl?: true
    codeKey?: true
    category?: true
    isActive?: true
    createdAt?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    previewUrl?: true
    codeKey?: true
    category?: true
    isActive?: true
    createdAt?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    previewUrl?: true
    codeKey?: true
    category?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    name: string
    description: string | null
    previewUrl: string | null
    codeKey: string
    category: string
    isActive: boolean
    createdAt: Date
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    previewUrl?: boolean
    codeKey?: boolean
    category?: boolean
    isActive?: boolean
    createdAt?: boolean
    events?: boolean | Template$eventsArgs<ExtArgs>
    _count?: boolean | TemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>


  export type TemplateSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    previewUrl?: boolean
    codeKey?: boolean
    category?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type TemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | Template$eventsArgs<ExtArgs>
    _count?: boolean | TemplateCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      previewUrl: string | null
      codeKey: string
      category: string
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends Template$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Template$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Template model
   */ 
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly name: FieldRef<"Template", 'String'>
    readonly description: FieldRef<"Template", 'String'>
    readonly previewUrl: FieldRef<"Template", 'String'>
    readonly codeKey: FieldRef<"Template", 'String'>
    readonly category: FieldRef<"Template", 'String'>
    readonly isActive: FieldRef<"Template", 'Boolean'>
    readonly createdAt: FieldRef<"Template", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
  }

  /**
   * Template.events
   */
  export type Template$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
  }


  /**
   * Model GlobalAsset
   */

  export type AggregateGlobalAsset = {
    _count: GlobalAssetCountAggregateOutputType | null
    _min: GlobalAssetMinAggregateOutputType | null
    _max: GlobalAssetMaxAggregateOutputType | null
  }

  export type GlobalAssetMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    url: string | null
    createdAt: Date | null
  }

  export type GlobalAssetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    url: string | null
    createdAt: Date | null
  }

  export type GlobalAssetCountAggregateOutputType = {
    id: number
    name: number
    type: number
    url: number
    createdAt: number
    _all: number
  }


  export type GlobalAssetMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    url?: true
    createdAt?: true
  }

  export type GlobalAssetMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    url?: true
    createdAt?: true
  }

  export type GlobalAssetCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    url?: true
    createdAt?: true
    _all?: true
  }

  export type GlobalAssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalAsset to aggregate.
     */
    where?: GlobalAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalAssets to fetch.
     */
    orderBy?: GlobalAssetOrderByWithRelationInput | GlobalAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GlobalAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GlobalAssets
    **/
    _count?: true | GlobalAssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GlobalAssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GlobalAssetMaxAggregateInputType
  }

  export type GetGlobalAssetAggregateType<T extends GlobalAssetAggregateArgs> = {
        [P in keyof T & keyof AggregateGlobalAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGlobalAsset[P]>
      : GetScalarType<T[P], AggregateGlobalAsset[P]>
  }




  export type GlobalAssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GlobalAssetWhereInput
    orderBy?: GlobalAssetOrderByWithAggregationInput | GlobalAssetOrderByWithAggregationInput[]
    by: GlobalAssetScalarFieldEnum[] | GlobalAssetScalarFieldEnum
    having?: GlobalAssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GlobalAssetCountAggregateInputType | true
    _min?: GlobalAssetMinAggregateInputType
    _max?: GlobalAssetMaxAggregateInputType
  }

  export type GlobalAssetGroupByOutputType = {
    id: string
    name: string
    type: string
    url: string
    createdAt: Date
    _count: GlobalAssetCountAggregateOutputType | null
    _min: GlobalAssetMinAggregateOutputType | null
    _max: GlobalAssetMaxAggregateOutputType | null
  }

  type GetGlobalAssetGroupByPayload<T extends GlobalAssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GlobalAssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GlobalAssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GlobalAssetGroupByOutputType[P]>
            : GetScalarType<T[P], GlobalAssetGroupByOutputType[P]>
        }
      >
    >


  export type GlobalAssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    url?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["globalAsset"]>


  export type GlobalAssetSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    url?: boolean
    createdAt?: boolean
  }


  export type $GlobalAssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GlobalAsset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      url: string
      createdAt: Date
    }, ExtArgs["result"]["globalAsset"]>
    composites: {}
  }

  type GlobalAssetGetPayload<S extends boolean | null | undefined | GlobalAssetDefaultArgs> = $Result.GetResult<Prisma.$GlobalAssetPayload, S>

  type GlobalAssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GlobalAssetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GlobalAssetCountAggregateInputType | true
    }

  export interface GlobalAssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GlobalAsset'], meta: { name: 'GlobalAsset' } }
    /**
     * Find zero or one GlobalAsset that matches the filter.
     * @param {GlobalAssetFindUniqueArgs} args - Arguments to find a GlobalAsset
     * @example
     * // Get one GlobalAsset
     * const globalAsset = await prisma.globalAsset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GlobalAssetFindUniqueArgs>(args: SelectSubset<T, GlobalAssetFindUniqueArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GlobalAsset that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GlobalAssetFindUniqueOrThrowArgs} args - Arguments to find a GlobalAsset
     * @example
     * // Get one GlobalAsset
     * const globalAsset = await prisma.globalAsset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GlobalAssetFindUniqueOrThrowArgs>(args: SelectSubset<T, GlobalAssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GlobalAsset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetFindFirstArgs} args - Arguments to find a GlobalAsset
     * @example
     * // Get one GlobalAsset
     * const globalAsset = await prisma.globalAsset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GlobalAssetFindFirstArgs>(args?: SelectSubset<T, GlobalAssetFindFirstArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GlobalAsset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetFindFirstOrThrowArgs} args - Arguments to find a GlobalAsset
     * @example
     * // Get one GlobalAsset
     * const globalAsset = await prisma.globalAsset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GlobalAssetFindFirstOrThrowArgs>(args?: SelectSubset<T, GlobalAssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GlobalAssets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GlobalAssets
     * const globalAssets = await prisma.globalAsset.findMany()
     * 
     * // Get first 10 GlobalAssets
     * const globalAssets = await prisma.globalAsset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const globalAssetWithIdOnly = await prisma.globalAsset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GlobalAssetFindManyArgs>(args?: SelectSubset<T, GlobalAssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GlobalAsset.
     * @param {GlobalAssetCreateArgs} args - Arguments to create a GlobalAsset.
     * @example
     * // Create one GlobalAsset
     * const GlobalAsset = await prisma.globalAsset.create({
     *   data: {
     *     // ... data to create a GlobalAsset
     *   }
     * })
     * 
     */
    create<T extends GlobalAssetCreateArgs>(args: SelectSubset<T, GlobalAssetCreateArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GlobalAssets.
     * @param {GlobalAssetCreateManyArgs} args - Arguments to create many GlobalAssets.
     * @example
     * // Create many GlobalAssets
     * const globalAsset = await prisma.globalAsset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GlobalAssetCreateManyArgs>(args?: SelectSubset<T, GlobalAssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GlobalAsset.
     * @param {GlobalAssetDeleteArgs} args - Arguments to delete one GlobalAsset.
     * @example
     * // Delete one GlobalAsset
     * const GlobalAsset = await prisma.globalAsset.delete({
     *   where: {
     *     // ... filter to delete one GlobalAsset
     *   }
     * })
     * 
     */
    delete<T extends GlobalAssetDeleteArgs>(args: SelectSubset<T, GlobalAssetDeleteArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GlobalAsset.
     * @param {GlobalAssetUpdateArgs} args - Arguments to update one GlobalAsset.
     * @example
     * // Update one GlobalAsset
     * const globalAsset = await prisma.globalAsset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GlobalAssetUpdateArgs>(args: SelectSubset<T, GlobalAssetUpdateArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GlobalAssets.
     * @param {GlobalAssetDeleteManyArgs} args - Arguments to filter GlobalAssets to delete.
     * @example
     * // Delete a few GlobalAssets
     * const { count } = await prisma.globalAsset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GlobalAssetDeleteManyArgs>(args?: SelectSubset<T, GlobalAssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlobalAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GlobalAssets
     * const globalAsset = await prisma.globalAsset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GlobalAssetUpdateManyArgs>(args: SelectSubset<T, GlobalAssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GlobalAsset.
     * @param {GlobalAssetUpsertArgs} args - Arguments to update or create a GlobalAsset.
     * @example
     * // Update or create a GlobalAsset
     * const globalAsset = await prisma.globalAsset.upsert({
     *   create: {
     *     // ... data to create a GlobalAsset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GlobalAsset we want to update
     *   }
     * })
     */
    upsert<T extends GlobalAssetUpsertArgs>(args: SelectSubset<T, GlobalAssetUpsertArgs<ExtArgs>>): Prisma__GlobalAssetClient<$Result.GetResult<Prisma.$GlobalAssetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GlobalAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetCountArgs} args - Arguments to filter GlobalAssets to count.
     * @example
     * // Count the number of GlobalAssets
     * const count = await prisma.globalAsset.count({
     *   where: {
     *     // ... the filter for the GlobalAssets we want to count
     *   }
     * })
    **/
    count<T extends GlobalAssetCountArgs>(
      args?: Subset<T, GlobalAssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GlobalAssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GlobalAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GlobalAssetAggregateArgs>(args: Subset<T, GlobalAssetAggregateArgs>): Prisma.PrismaPromise<GetGlobalAssetAggregateType<T>>

    /**
     * Group by GlobalAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalAssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GlobalAssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GlobalAssetGroupByArgs['orderBy'] }
        : { orderBy?: GlobalAssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GlobalAssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGlobalAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GlobalAsset model
   */
  readonly fields: GlobalAssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GlobalAsset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GlobalAssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GlobalAsset model
   */ 
  interface GlobalAssetFieldRefs {
    readonly id: FieldRef<"GlobalAsset", 'String'>
    readonly name: FieldRef<"GlobalAsset", 'String'>
    readonly type: FieldRef<"GlobalAsset", 'String'>
    readonly url: FieldRef<"GlobalAsset", 'String'>
    readonly createdAt: FieldRef<"GlobalAsset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GlobalAsset findUnique
   */
  export type GlobalAssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * Filter, which GlobalAsset to fetch.
     */
    where: GlobalAssetWhereUniqueInput
  }

  /**
   * GlobalAsset findUniqueOrThrow
   */
  export type GlobalAssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * Filter, which GlobalAsset to fetch.
     */
    where: GlobalAssetWhereUniqueInput
  }

  /**
   * GlobalAsset findFirst
   */
  export type GlobalAssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * Filter, which GlobalAsset to fetch.
     */
    where?: GlobalAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalAssets to fetch.
     */
    orderBy?: GlobalAssetOrderByWithRelationInput | GlobalAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalAssets.
     */
    cursor?: GlobalAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalAssets.
     */
    distinct?: GlobalAssetScalarFieldEnum | GlobalAssetScalarFieldEnum[]
  }

  /**
   * GlobalAsset findFirstOrThrow
   */
  export type GlobalAssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * Filter, which GlobalAsset to fetch.
     */
    where?: GlobalAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalAssets to fetch.
     */
    orderBy?: GlobalAssetOrderByWithRelationInput | GlobalAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalAssets.
     */
    cursor?: GlobalAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalAssets.
     */
    distinct?: GlobalAssetScalarFieldEnum | GlobalAssetScalarFieldEnum[]
  }

  /**
   * GlobalAsset findMany
   */
  export type GlobalAssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * Filter, which GlobalAssets to fetch.
     */
    where?: GlobalAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalAssets to fetch.
     */
    orderBy?: GlobalAssetOrderByWithRelationInput | GlobalAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GlobalAssets.
     */
    cursor?: GlobalAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalAssets.
     */
    skip?: number
    distinct?: GlobalAssetScalarFieldEnum | GlobalAssetScalarFieldEnum[]
  }

  /**
   * GlobalAsset create
   */
  export type GlobalAssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * The data needed to create a GlobalAsset.
     */
    data: XOR<GlobalAssetCreateInput, GlobalAssetUncheckedCreateInput>
  }

  /**
   * GlobalAsset createMany
   */
  export type GlobalAssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GlobalAssets.
     */
    data: GlobalAssetCreateManyInput | GlobalAssetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalAsset update
   */
  export type GlobalAssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * The data needed to update a GlobalAsset.
     */
    data: XOR<GlobalAssetUpdateInput, GlobalAssetUncheckedUpdateInput>
    /**
     * Choose, which GlobalAsset to update.
     */
    where: GlobalAssetWhereUniqueInput
  }

  /**
   * GlobalAsset updateMany
   */
  export type GlobalAssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GlobalAssets.
     */
    data: XOR<GlobalAssetUpdateManyMutationInput, GlobalAssetUncheckedUpdateManyInput>
    /**
     * Filter which GlobalAssets to update
     */
    where?: GlobalAssetWhereInput
  }

  /**
   * GlobalAsset upsert
   */
  export type GlobalAssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * The filter to search for the GlobalAsset to update in case it exists.
     */
    where: GlobalAssetWhereUniqueInput
    /**
     * In case the GlobalAsset found by the `where` argument doesn't exist, create a new GlobalAsset with this data.
     */
    create: XOR<GlobalAssetCreateInput, GlobalAssetUncheckedCreateInput>
    /**
     * In case the GlobalAsset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GlobalAssetUpdateInput, GlobalAssetUncheckedUpdateInput>
  }

  /**
   * GlobalAsset delete
   */
  export type GlobalAssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
    /**
     * Filter which GlobalAsset to delete.
     */
    where: GlobalAssetWhereUniqueInput
  }

  /**
   * GlobalAsset deleteMany
   */
  export type GlobalAssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalAssets to delete
     */
    where?: GlobalAssetWhereInput
  }

  /**
   * GlobalAsset without action
   */
  export type GlobalAssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalAsset
     */
    select?: GlobalAssetSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    date: 'date',
    location: 'location',
    description: 'description',
    eventType: 'eventType',
    templateId: 'templateId',
    musicUrl: 'musicUrl',
    logoUrl: 'logoUrl',
    logoSize: 'logoSize',
    groomFatherName: 'groomFatherName',
    groomMotherName: 'groomMotherName',
    brideFatherName: 'brideFatherName',
    brideMotherName: 'brideMotherName',
    groomFirstName: 'groomFirstName',
    groomLastName: 'groomLastName',
    brideFirstName: 'brideFirstName',
    brideLastName: 'brideLastName',
    invitationMessage: 'invitationMessage',
    eventTime: 'eventTime',
    venueDetails: 'venueDetails',
    mapUrl: 'mapUrl',
    startDate: 'startDate',
    endDate: 'endDate',
    eventDays: 'eventDays',
    schedule: 'schedule',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const GuestScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    shortCode: 'shortCode',
    token: 'token',
    status: 'status',
    eventId: 'eventId',
    phoneNumber: 'phoneNumber'
  };

  export type GuestScalarFieldEnum = (typeof GuestScalarFieldEnum)[keyof typeof GuestScalarFieldEnum]


  export const AlbumPhotoScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    imageUrl: 'imageUrl',
    order: 'order',
    createdAt: 'createdAt'
  };

  export type AlbumPhotoScalarFieldEnum = (typeof AlbumPhotoScalarFieldEnum)[keyof typeof AlbumPhotoScalarFieldEnum]


  export const TemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    previewUrl: 'previewUrl',
    codeKey: 'codeKey',
    category: 'category',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const GlobalAssetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    url: 'url',
    createdAt: 'createdAt'
  };

  export type GlobalAssetScalarFieldEnum = (typeof GlobalAssetScalarFieldEnum)[keyof typeof GlobalAssetScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    events?: EventListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    events?: EventOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    events?: EventListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    slug?: StringNullableFilter<"Event"> | string | null
    date?: DateTimeFilter<"Event"> | Date | string
    location?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    eventType?: StringFilter<"Event"> | string
    templateId?: StringFilter<"Event"> | string
    musicUrl?: StringNullableFilter<"Event"> | string | null
    logoUrl?: StringNullableFilter<"Event"> | string | null
    logoSize?: IntFilter<"Event"> | number
    groomFatherName?: StringNullableFilter<"Event"> | string | null
    groomMotherName?: StringNullableFilter<"Event"> | string | null
    brideFatherName?: StringNullableFilter<"Event"> | string | null
    brideMotherName?: StringNullableFilter<"Event"> | string | null
    groomFirstName?: StringNullableFilter<"Event"> | string | null
    groomLastName?: StringNullableFilter<"Event"> | string | null
    brideFirstName?: StringNullableFilter<"Event"> | string | null
    brideLastName?: StringNullableFilter<"Event"> | string | null
    invitationMessage?: StringNullableFilter<"Event"> | string | null
    eventTime?: StringNullableFilter<"Event"> | string | null
    venueDetails?: StringNullableFilter<"Event"> | string | null
    mapUrl?: StringNullableFilter<"Event"> | string | null
    startDate?: DateTimeFilter<"Event"> | Date | string
    endDate?: DateTimeNullableFilter<"Event"> | Date | string | null
    eventDays?: StringNullableFilter<"Event"> | string | null
    schedule?: StringNullableFilter<"Event"> | string | null
    userId?: StringFilter<"Event"> | string
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    template?: XOR<TemplateRelationFilter, TemplateWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    guests?: GuestListRelationFilter
    albumPhotos?: AlbumPhotoListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrderInput | SortOrder
    date?: SortOrder
    location?: SortOrder
    description?: SortOrderInput | SortOrder
    eventType?: SortOrder
    templateId?: SortOrder
    musicUrl?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    logoSize?: SortOrder
    groomFatherName?: SortOrderInput | SortOrder
    groomMotherName?: SortOrderInput | SortOrder
    brideFatherName?: SortOrderInput | SortOrder
    brideMotherName?: SortOrderInput | SortOrder
    groomFirstName?: SortOrderInput | SortOrder
    groomLastName?: SortOrderInput | SortOrder
    brideFirstName?: SortOrderInput | SortOrder
    brideLastName?: SortOrderInput | SortOrder
    invitationMessage?: SortOrderInput | SortOrder
    eventTime?: SortOrderInput | SortOrder
    venueDetails?: SortOrderInput | SortOrder
    mapUrl?: SortOrderInput | SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    eventDays?: SortOrderInput | SortOrder
    schedule?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    template?: TemplateOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    guests?: GuestOrderByRelationAggregateInput
    albumPhotos?: AlbumPhotoOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    title?: StringFilter<"Event"> | string
    date?: DateTimeFilter<"Event"> | Date | string
    location?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    eventType?: StringFilter<"Event"> | string
    templateId?: StringFilter<"Event"> | string
    musicUrl?: StringNullableFilter<"Event"> | string | null
    logoUrl?: StringNullableFilter<"Event"> | string | null
    logoSize?: IntFilter<"Event"> | number
    groomFatherName?: StringNullableFilter<"Event"> | string | null
    groomMotherName?: StringNullableFilter<"Event"> | string | null
    brideFatherName?: StringNullableFilter<"Event"> | string | null
    brideMotherName?: StringNullableFilter<"Event"> | string | null
    groomFirstName?: StringNullableFilter<"Event"> | string | null
    groomLastName?: StringNullableFilter<"Event"> | string | null
    brideFirstName?: StringNullableFilter<"Event"> | string | null
    brideLastName?: StringNullableFilter<"Event"> | string | null
    invitationMessage?: StringNullableFilter<"Event"> | string | null
    eventTime?: StringNullableFilter<"Event"> | string | null
    venueDetails?: StringNullableFilter<"Event"> | string | null
    mapUrl?: StringNullableFilter<"Event"> | string | null
    startDate?: DateTimeFilter<"Event"> | Date | string
    endDate?: DateTimeNullableFilter<"Event"> | Date | string | null
    eventDays?: StringNullableFilter<"Event"> | string | null
    schedule?: StringNullableFilter<"Event"> | string | null
    userId?: StringFilter<"Event"> | string
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    template?: XOR<TemplateRelationFilter, TemplateWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    guests?: GuestListRelationFilter
    albumPhotos?: AlbumPhotoListRelationFilter
  }, "id" | "slug">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrderInput | SortOrder
    date?: SortOrder
    location?: SortOrder
    description?: SortOrderInput | SortOrder
    eventType?: SortOrder
    templateId?: SortOrder
    musicUrl?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    logoSize?: SortOrder
    groomFatherName?: SortOrderInput | SortOrder
    groomMotherName?: SortOrderInput | SortOrder
    brideFatherName?: SortOrderInput | SortOrder
    brideMotherName?: SortOrderInput | SortOrder
    groomFirstName?: SortOrderInput | SortOrder
    groomLastName?: SortOrderInput | SortOrder
    brideFirstName?: SortOrderInput | SortOrder
    brideLastName?: SortOrderInput | SortOrder
    invitationMessage?: SortOrderInput | SortOrder
    eventTime?: SortOrderInput | SortOrder
    venueDetails?: SortOrderInput | SortOrder
    mapUrl?: SortOrderInput | SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    eventDays?: SortOrderInput | SortOrder
    schedule?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    title?: StringWithAggregatesFilter<"Event"> | string
    slug?: StringNullableWithAggregatesFilter<"Event"> | string | null
    date?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    location?: StringWithAggregatesFilter<"Event"> | string
    description?: StringNullableWithAggregatesFilter<"Event"> | string | null
    eventType?: StringWithAggregatesFilter<"Event"> | string
    templateId?: StringWithAggregatesFilter<"Event"> | string
    musicUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
    logoUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
    logoSize?: IntWithAggregatesFilter<"Event"> | number
    groomFatherName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    groomMotherName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    brideFatherName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    brideMotherName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    groomFirstName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    groomLastName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    brideFirstName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    brideLastName?: StringNullableWithAggregatesFilter<"Event"> | string | null
    invitationMessage?: StringNullableWithAggregatesFilter<"Event"> | string | null
    eventTime?: StringNullableWithAggregatesFilter<"Event"> | string | null
    venueDetails?: StringNullableWithAggregatesFilter<"Event"> | string | null
    mapUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
    startDate?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    eventDays?: StringNullableWithAggregatesFilter<"Event"> | string | null
    schedule?: StringNullableWithAggregatesFilter<"Event"> | string | null
    userId?: StringWithAggregatesFilter<"Event"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
  }

  export type GuestWhereInput = {
    AND?: GuestWhereInput | GuestWhereInput[]
    OR?: GuestWhereInput[]
    NOT?: GuestWhereInput | GuestWhereInput[]
    id?: StringFilter<"Guest"> | string
    name?: StringFilter<"Guest"> | string
    email?: StringNullableFilter<"Guest"> | string | null
    shortCode?: StringNullableFilter<"Guest"> | string | null
    token?: StringFilter<"Guest"> | string
    status?: StringFilter<"Guest"> | string
    eventId?: StringFilter<"Guest"> | string
    phoneNumber?: StringNullableFilter<"Guest"> | string | null
    event?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type GuestOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    shortCode?: SortOrderInput | SortOrder
    token?: SortOrder
    status?: SortOrder
    eventId?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type GuestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shortCode?: string
    token?: string
    AND?: GuestWhereInput | GuestWhereInput[]
    OR?: GuestWhereInput[]
    NOT?: GuestWhereInput | GuestWhereInput[]
    name?: StringFilter<"Guest"> | string
    email?: StringNullableFilter<"Guest"> | string | null
    status?: StringFilter<"Guest"> | string
    eventId?: StringFilter<"Guest"> | string
    phoneNumber?: StringNullableFilter<"Guest"> | string | null
    event?: XOR<EventRelationFilter, EventWhereInput>
  }, "id" | "shortCode" | "token">

  export type GuestOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    shortCode?: SortOrderInput | SortOrder
    token?: SortOrder
    status?: SortOrder
    eventId?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    _count?: GuestCountOrderByAggregateInput
    _max?: GuestMaxOrderByAggregateInput
    _min?: GuestMinOrderByAggregateInput
  }

  export type GuestScalarWhereWithAggregatesInput = {
    AND?: GuestScalarWhereWithAggregatesInput | GuestScalarWhereWithAggregatesInput[]
    OR?: GuestScalarWhereWithAggregatesInput[]
    NOT?: GuestScalarWhereWithAggregatesInput | GuestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Guest"> | string
    name?: StringWithAggregatesFilter<"Guest"> | string
    email?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    shortCode?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    token?: StringWithAggregatesFilter<"Guest"> | string
    status?: StringWithAggregatesFilter<"Guest"> | string
    eventId?: StringWithAggregatesFilter<"Guest"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"Guest"> | string | null
  }

  export type AlbumPhotoWhereInput = {
    AND?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    OR?: AlbumPhotoWhereInput[]
    NOT?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    id?: StringFilter<"AlbumPhoto"> | string
    eventId?: StringFilter<"AlbumPhoto"> | string
    imageUrl?: StringFilter<"AlbumPhoto"> | string
    order?: IntFilter<"AlbumPhoto"> | number
    createdAt?: DateTimeFilter<"AlbumPhoto"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type AlbumPhotoOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    imageUrl?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type AlbumPhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    OR?: AlbumPhotoWhereInput[]
    NOT?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    eventId?: StringFilter<"AlbumPhoto"> | string
    imageUrl?: StringFilter<"AlbumPhoto"> | string
    order?: IntFilter<"AlbumPhoto"> | number
    createdAt?: DateTimeFilter<"AlbumPhoto"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
  }, "id">

  export type AlbumPhotoOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    imageUrl?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    _count?: AlbumPhotoCountOrderByAggregateInput
    _avg?: AlbumPhotoAvgOrderByAggregateInput
    _max?: AlbumPhotoMaxOrderByAggregateInput
    _min?: AlbumPhotoMinOrderByAggregateInput
    _sum?: AlbumPhotoSumOrderByAggregateInput
  }

  export type AlbumPhotoScalarWhereWithAggregatesInput = {
    AND?: AlbumPhotoScalarWhereWithAggregatesInput | AlbumPhotoScalarWhereWithAggregatesInput[]
    OR?: AlbumPhotoScalarWhereWithAggregatesInput[]
    NOT?: AlbumPhotoScalarWhereWithAggregatesInput | AlbumPhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AlbumPhoto"> | string
    eventId?: StringWithAggregatesFilter<"AlbumPhoto"> | string
    imageUrl?: StringWithAggregatesFilter<"AlbumPhoto"> | string
    order?: IntWithAggregatesFilter<"AlbumPhoto"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AlbumPhoto"> | Date | string
  }

  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    previewUrl?: StringNullableFilter<"Template"> | string | null
    codeKey?: StringFilter<"Template"> | string
    category?: StringFilter<"Template"> | string
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    events?: EventListRelationFilter
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    previewUrl?: SortOrderInput | SortOrder
    codeKey?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    events?: EventOrderByRelationAggregateInput
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    codeKey?: string
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    previewUrl?: StringNullableFilter<"Template"> | string | null
    category?: StringFilter<"Template"> | string
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    events?: EventListRelationFilter
  }, "id" | "codeKey">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    previewUrl?: SortOrderInput | SortOrder
    codeKey?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    name?: StringWithAggregatesFilter<"Template"> | string
    description?: StringNullableWithAggregatesFilter<"Template"> | string | null
    previewUrl?: StringNullableWithAggregatesFilter<"Template"> | string | null
    codeKey?: StringWithAggregatesFilter<"Template"> | string
    category?: StringWithAggregatesFilter<"Template"> | string
    isActive?: BoolWithAggregatesFilter<"Template"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
  }

  export type GlobalAssetWhereInput = {
    AND?: GlobalAssetWhereInput | GlobalAssetWhereInput[]
    OR?: GlobalAssetWhereInput[]
    NOT?: GlobalAssetWhereInput | GlobalAssetWhereInput[]
    id?: StringFilter<"GlobalAsset"> | string
    name?: StringFilter<"GlobalAsset"> | string
    type?: StringFilter<"GlobalAsset"> | string
    url?: StringFilter<"GlobalAsset"> | string
    createdAt?: DateTimeFilter<"GlobalAsset"> | Date | string
  }

  export type GlobalAssetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type GlobalAssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GlobalAssetWhereInput | GlobalAssetWhereInput[]
    OR?: GlobalAssetWhereInput[]
    NOT?: GlobalAssetWhereInput | GlobalAssetWhereInput[]
    name?: StringFilter<"GlobalAsset"> | string
    type?: StringFilter<"GlobalAsset"> | string
    url?: StringFilter<"GlobalAsset"> | string
    createdAt?: DateTimeFilter<"GlobalAsset"> | Date | string
  }, "id">

  export type GlobalAssetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    _count?: GlobalAssetCountOrderByAggregateInput
    _max?: GlobalAssetMaxOrderByAggregateInput
    _min?: GlobalAssetMinOrderByAggregateInput
  }

  export type GlobalAssetScalarWhereWithAggregatesInput = {
    AND?: GlobalAssetScalarWhereWithAggregatesInput | GlobalAssetScalarWhereWithAggregatesInput[]
    OR?: GlobalAssetScalarWhereWithAggregatesInput[]
    NOT?: GlobalAssetScalarWhereWithAggregatesInput | GlobalAssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GlobalAsset"> | string
    name?: StringWithAggregatesFilter<"GlobalAsset"> | string
    type?: StringWithAggregatesFilter<"GlobalAsset"> | string
    url?: StringWithAggregatesFilter<"GlobalAsset"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GlobalAsset"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    createdAt?: Date | string
    events?: EventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    createdAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    template?: TemplateCreateNestedOneWithoutEventsInput
    user: UserCreateNestedOneWithoutEventsInput
    guests?: GuestCreateNestedManyWithoutEventInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    templateId?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    guests?: GuestUncheckedCreateNestedManyWithoutEventInput
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: TemplateUpdateOneRequiredWithoutEventsNestedInput
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    guests?: GuestUpdateManyWithoutEventNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: GuestUncheckedUpdateManyWithoutEventNestedInput
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    templateId?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestCreateInput = {
    id?: string
    name: string
    email?: string | null
    shortCode?: string | null
    token?: string
    status?: string
    phoneNumber?: string | null
    event: EventCreateNestedOneWithoutGuestsInput
  }

  export type GuestUncheckedCreateInput = {
    id?: string
    name: string
    email?: string | null
    shortCode?: string | null
    token?: string
    status?: string
    eventId: string
    phoneNumber?: string | null
  }

  export type GuestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    event?: EventUpdateOneRequiredWithoutGuestsNestedInput
  }

  export type GuestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GuestCreateManyInput = {
    id?: string
    name: string
    email?: string | null
    shortCode?: string | null
    token?: string
    status?: string
    eventId: string
    phoneNumber?: string | null
  }

  export type GuestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GuestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AlbumPhotoCreateInput = {
    id?: string
    imageUrl: string
    order?: number
    createdAt?: Date | string
    event: EventCreateNestedOneWithoutAlbumPhotosInput
  }

  export type AlbumPhotoUncheckedCreateInput = {
    id?: string
    eventId: string
    imageUrl: string
    order?: number
    createdAt?: Date | string
  }

  export type AlbumPhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutAlbumPhotosNestedInput
  }

  export type AlbumPhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoCreateManyInput = {
    id?: string
    eventId: string
    imageUrl: string
    order?: number
    createdAt?: Date | string
  }

  export type AlbumPhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateInput = {
    id?: string
    name: string
    description?: string | null
    previewUrl?: string | null
    codeKey: string
    category: string
    isActive?: boolean
    createdAt?: Date | string
    events?: EventCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    previewUrl?: string | null
    codeKey: string
    category: string
    isActive?: boolean
    createdAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeKey?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeKey?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    previewUrl?: string | null
    codeKey: string
    category: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeKey?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeKey?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalAssetCreateInput = {
    id?: string
    name: string
    type: string
    url: string
    createdAt?: Date | string
  }

  export type GlobalAssetUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    url: string
    createdAt?: Date | string
  }

  export type GlobalAssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalAssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalAssetCreateManyInput = {
    id?: string
    name: string
    type: string
    url: string
    createdAt?: Date | string
  }

  export type GlobalAssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalAssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TemplateRelationFilter = {
    is?: TemplateWhereInput
    isNot?: TemplateWhereInput
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type GuestListRelationFilter = {
    every?: GuestWhereInput
    some?: GuestWhereInput
    none?: GuestWhereInput
  }

  export type AlbumPhotoListRelationFilter = {
    every?: AlbumPhotoWhereInput
    some?: AlbumPhotoWhereInput
    none?: AlbumPhotoWhereInput
  }

  export type GuestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlbumPhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    date?: SortOrder
    location?: SortOrder
    description?: SortOrder
    eventType?: SortOrder
    templateId?: SortOrder
    musicUrl?: SortOrder
    logoUrl?: SortOrder
    logoSize?: SortOrder
    groomFatherName?: SortOrder
    groomMotherName?: SortOrder
    brideFatherName?: SortOrder
    brideMotherName?: SortOrder
    groomFirstName?: SortOrder
    groomLastName?: SortOrder
    brideFirstName?: SortOrder
    brideLastName?: SortOrder
    invitationMessage?: SortOrder
    eventTime?: SortOrder
    venueDetails?: SortOrder
    mapUrl?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    eventDays?: SortOrder
    schedule?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    logoSize?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    date?: SortOrder
    location?: SortOrder
    description?: SortOrder
    eventType?: SortOrder
    templateId?: SortOrder
    musicUrl?: SortOrder
    logoUrl?: SortOrder
    logoSize?: SortOrder
    groomFatherName?: SortOrder
    groomMotherName?: SortOrder
    brideFatherName?: SortOrder
    brideMotherName?: SortOrder
    groomFirstName?: SortOrder
    groomLastName?: SortOrder
    brideFirstName?: SortOrder
    brideLastName?: SortOrder
    invitationMessage?: SortOrder
    eventTime?: SortOrder
    venueDetails?: SortOrder
    mapUrl?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    eventDays?: SortOrder
    schedule?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    date?: SortOrder
    location?: SortOrder
    description?: SortOrder
    eventType?: SortOrder
    templateId?: SortOrder
    musicUrl?: SortOrder
    logoUrl?: SortOrder
    logoSize?: SortOrder
    groomFatherName?: SortOrder
    groomMotherName?: SortOrder
    brideFatherName?: SortOrder
    brideMotherName?: SortOrder
    groomFirstName?: SortOrder
    groomLastName?: SortOrder
    brideFirstName?: SortOrder
    brideLastName?: SortOrder
    invitationMessage?: SortOrder
    eventTime?: SortOrder
    venueDetails?: SortOrder
    mapUrl?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    eventDays?: SortOrder
    schedule?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    logoSize?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EventRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type GuestCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    shortCode?: SortOrder
    token?: SortOrder
    status?: SortOrder
    eventId?: SortOrder
    phoneNumber?: SortOrder
  }

  export type GuestMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    shortCode?: SortOrder
    token?: SortOrder
    status?: SortOrder
    eventId?: SortOrder
    phoneNumber?: SortOrder
  }

  export type GuestMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    shortCode?: SortOrder
    token?: SortOrder
    status?: SortOrder
    eventId?: SortOrder
    phoneNumber?: SortOrder
  }

  export type AlbumPhotoCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    imageUrl?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumPhotoAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type AlbumPhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    imageUrl?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumPhotoMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    imageUrl?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumPhotoSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    previewUrl?: SortOrder
    codeKey?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    previewUrl?: SortOrder
    codeKey?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    previewUrl?: SortOrder
    codeKey?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type GlobalAssetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type GlobalAssetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type GlobalAssetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type EventCreateNestedManyWithoutUserInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EventUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutUserInput | EventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutUserInput | EventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventUpdateManyWithWhereWithoutUserInput | EventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutUserInput | EventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutUserInput | EventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventUpdateManyWithWhereWithoutUserInput | EventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type TemplateCreateNestedOneWithoutEventsInput = {
    create?: XOR<TemplateCreateWithoutEventsInput, TemplateUncheckedCreateWithoutEventsInput>
    connectOrCreate?: TemplateCreateOrConnectWithoutEventsInput
    connect?: TemplateWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutEventsInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    connect?: UserWhereUniqueInput
  }

  export type GuestCreateNestedManyWithoutEventInput = {
    create?: XOR<GuestCreateWithoutEventInput, GuestUncheckedCreateWithoutEventInput> | GuestCreateWithoutEventInput[] | GuestUncheckedCreateWithoutEventInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutEventInput | GuestCreateOrConnectWithoutEventInput[]
    createMany?: GuestCreateManyEventInputEnvelope
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
  }

  export type AlbumPhotoCreateNestedManyWithoutEventInput = {
    create?: XOR<AlbumPhotoCreateWithoutEventInput, AlbumPhotoUncheckedCreateWithoutEventInput> | AlbumPhotoCreateWithoutEventInput[] | AlbumPhotoUncheckedCreateWithoutEventInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutEventInput | AlbumPhotoCreateOrConnectWithoutEventInput[]
    createMany?: AlbumPhotoCreateManyEventInputEnvelope
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
  }

  export type GuestUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<GuestCreateWithoutEventInput, GuestUncheckedCreateWithoutEventInput> | GuestCreateWithoutEventInput[] | GuestUncheckedCreateWithoutEventInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutEventInput | GuestCreateOrConnectWithoutEventInput[]
    createMany?: GuestCreateManyEventInputEnvelope
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
  }

  export type AlbumPhotoUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<AlbumPhotoCreateWithoutEventInput, AlbumPhotoUncheckedCreateWithoutEventInput> | AlbumPhotoCreateWithoutEventInput[] | AlbumPhotoUncheckedCreateWithoutEventInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutEventInput | AlbumPhotoCreateOrConnectWithoutEventInput[]
    createMany?: AlbumPhotoCreateManyEventInputEnvelope
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TemplateUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<TemplateCreateWithoutEventsInput, TemplateUncheckedCreateWithoutEventsInput>
    connectOrCreate?: TemplateCreateOrConnectWithoutEventsInput
    upsert?: TemplateUpsertWithoutEventsInput
    connect?: TemplateWhereUniqueInput
    update?: XOR<XOR<TemplateUpdateToOneWithWhereWithoutEventsInput, TemplateUpdateWithoutEventsInput>, TemplateUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    upsert?: UserUpsertWithoutEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventsInput, UserUpdateWithoutEventsInput>, UserUncheckedUpdateWithoutEventsInput>
  }

  export type GuestUpdateManyWithoutEventNestedInput = {
    create?: XOR<GuestCreateWithoutEventInput, GuestUncheckedCreateWithoutEventInput> | GuestCreateWithoutEventInput[] | GuestUncheckedCreateWithoutEventInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutEventInput | GuestCreateOrConnectWithoutEventInput[]
    upsert?: GuestUpsertWithWhereUniqueWithoutEventInput | GuestUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: GuestCreateManyEventInputEnvelope
    set?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    disconnect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    delete?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    update?: GuestUpdateWithWhereUniqueWithoutEventInput | GuestUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: GuestUpdateManyWithWhereWithoutEventInput | GuestUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: GuestScalarWhereInput | GuestScalarWhereInput[]
  }

  export type AlbumPhotoUpdateManyWithoutEventNestedInput = {
    create?: XOR<AlbumPhotoCreateWithoutEventInput, AlbumPhotoUncheckedCreateWithoutEventInput> | AlbumPhotoCreateWithoutEventInput[] | AlbumPhotoUncheckedCreateWithoutEventInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutEventInput | AlbumPhotoCreateOrConnectWithoutEventInput[]
    upsert?: AlbumPhotoUpsertWithWhereUniqueWithoutEventInput | AlbumPhotoUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: AlbumPhotoCreateManyEventInputEnvelope
    set?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    disconnect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    delete?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    update?: AlbumPhotoUpdateWithWhereUniqueWithoutEventInput | AlbumPhotoUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: AlbumPhotoUpdateManyWithWhereWithoutEventInput | AlbumPhotoUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
  }

  export type GuestUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<GuestCreateWithoutEventInput, GuestUncheckedCreateWithoutEventInput> | GuestCreateWithoutEventInput[] | GuestUncheckedCreateWithoutEventInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutEventInput | GuestCreateOrConnectWithoutEventInput[]
    upsert?: GuestUpsertWithWhereUniqueWithoutEventInput | GuestUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: GuestCreateManyEventInputEnvelope
    set?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    disconnect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    delete?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    update?: GuestUpdateWithWhereUniqueWithoutEventInput | GuestUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: GuestUpdateManyWithWhereWithoutEventInput | GuestUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: GuestScalarWhereInput | GuestScalarWhereInput[]
  }

  export type AlbumPhotoUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<AlbumPhotoCreateWithoutEventInput, AlbumPhotoUncheckedCreateWithoutEventInput> | AlbumPhotoCreateWithoutEventInput[] | AlbumPhotoUncheckedCreateWithoutEventInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutEventInput | AlbumPhotoCreateOrConnectWithoutEventInput[]
    upsert?: AlbumPhotoUpsertWithWhereUniqueWithoutEventInput | AlbumPhotoUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: AlbumPhotoCreateManyEventInputEnvelope
    set?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    disconnect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    delete?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    update?: AlbumPhotoUpdateWithWhereUniqueWithoutEventInput | AlbumPhotoUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: AlbumPhotoUpdateManyWithWhereWithoutEventInput | AlbumPhotoUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutGuestsInput = {
    create?: XOR<EventCreateWithoutGuestsInput, EventUncheckedCreateWithoutGuestsInput>
    connectOrCreate?: EventCreateOrConnectWithoutGuestsInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutGuestsNestedInput = {
    create?: XOR<EventCreateWithoutGuestsInput, EventUncheckedCreateWithoutGuestsInput>
    connectOrCreate?: EventCreateOrConnectWithoutGuestsInput
    upsert?: EventUpsertWithoutGuestsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutGuestsInput, EventUpdateWithoutGuestsInput>, EventUncheckedUpdateWithoutGuestsInput>
  }

  export type EventCreateNestedOneWithoutAlbumPhotosInput = {
    create?: XOR<EventCreateWithoutAlbumPhotosInput, EventUncheckedCreateWithoutAlbumPhotosInput>
    connectOrCreate?: EventCreateOrConnectWithoutAlbumPhotosInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutAlbumPhotosNestedInput = {
    create?: XOR<EventCreateWithoutAlbumPhotosInput, EventUncheckedCreateWithoutAlbumPhotosInput>
    connectOrCreate?: EventCreateOrConnectWithoutAlbumPhotosInput
    upsert?: EventUpsertWithoutAlbumPhotosInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutAlbumPhotosInput, EventUpdateWithoutAlbumPhotosInput>, EventUncheckedUpdateWithoutAlbumPhotosInput>
  }

  export type EventCreateNestedManyWithoutTemplateInput = {
    create?: XOR<EventCreateWithoutTemplateInput, EventUncheckedCreateWithoutTemplateInput> | EventCreateWithoutTemplateInput[] | EventUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: EventCreateOrConnectWithoutTemplateInput | EventCreateOrConnectWithoutTemplateInput[]
    createMany?: EventCreateManyTemplateInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<EventCreateWithoutTemplateInput, EventUncheckedCreateWithoutTemplateInput> | EventCreateWithoutTemplateInput[] | EventUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: EventCreateOrConnectWithoutTemplateInput | EventCreateOrConnectWithoutTemplateInput[]
    createMany?: EventCreateManyTemplateInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EventUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<EventCreateWithoutTemplateInput, EventUncheckedCreateWithoutTemplateInput> | EventCreateWithoutTemplateInput[] | EventUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: EventCreateOrConnectWithoutTemplateInput | EventCreateOrConnectWithoutTemplateInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutTemplateInput | EventUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: EventCreateManyTemplateInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutTemplateInput | EventUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: EventUpdateManyWithWhereWithoutTemplateInput | EventUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<EventCreateWithoutTemplateInput, EventUncheckedCreateWithoutTemplateInput> | EventCreateWithoutTemplateInput[] | EventUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: EventCreateOrConnectWithoutTemplateInput | EventCreateOrConnectWithoutTemplateInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutTemplateInput | EventUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: EventCreateManyTemplateInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutTemplateInput | EventUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: EventUpdateManyWithWhereWithoutTemplateInput | EventUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EventCreateWithoutUserInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    template?: TemplateCreateNestedOneWithoutEventsInput
    guests?: GuestCreateNestedManyWithoutEventInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    templateId?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guests?: GuestUncheckedCreateNestedManyWithoutEventInput
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutUserInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput>
  }

  export type EventCreateManyUserInputEnvelope = {
    data: EventCreateManyUserInput | EventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithWhereUniqueWithoutUserInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutUserInput, EventUncheckedUpdateWithoutUserInput>
    create: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput>
  }

  export type EventUpdateWithWhereUniqueWithoutUserInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutUserInput, EventUncheckedUpdateWithoutUserInput>
  }

  export type EventUpdateManyWithWhereWithoutUserInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutUserInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    slug?: StringNullableFilter<"Event"> | string | null
    date?: DateTimeFilter<"Event"> | Date | string
    location?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    eventType?: StringFilter<"Event"> | string
    templateId?: StringFilter<"Event"> | string
    musicUrl?: StringNullableFilter<"Event"> | string | null
    logoUrl?: StringNullableFilter<"Event"> | string | null
    logoSize?: IntFilter<"Event"> | number
    groomFatherName?: StringNullableFilter<"Event"> | string | null
    groomMotherName?: StringNullableFilter<"Event"> | string | null
    brideFatherName?: StringNullableFilter<"Event"> | string | null
    brideMotherName?: StringNullableFilter<"Event"> | string | null
    groomFirstName?: StringNullableFilter<"Event"> | string | null
    groomLastName?: StringNullableFilter<"Event"> | string | null
    brideFirstName?: StringNullableFilter<"Event"> | string | null
    brideLastName?: StringNullableFilter<"Event"> | string | null
    invitationMessage?: StringNullableFilter<"Event"> | string | null
    eventTime?: StringNullableFilter<"Event"> | string | null
    venueDetails?: StringNullableFilter<"Event"> | string | null
    mapUrl?: StringNullableFilter<"Event"> | string | null
    startDate?: DateTimeFilter<"Event"> | Date | string
    endDate?: DateTimeNullableFilter<"Event"> | Date | string | null
    eventDays?: StringNullableFilter<"Event"> | string | null
    schedule?: StringNullableFilter<"Event"> | string | null
    userId?: StringFilter<"Event"> | string
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
  }

  export type TemplateCreateWithoutEventsInput = {
    id?: string
    name: string
    description?: string | null
    previewUrl?: string | null
    codeKey: string
    category: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type TemplateUncheckedCreateWithoutEventsInput = {
    id?: string
    name: string
    description?: string | null
    previewUrl?: string | null
    codeKey: string
    category: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type TemplateCreateOrConnectWithoutEventsInput = {
    where: TemplateWhereUniqueInput
    create: XOR<TemplateCreateWithoutEventsInput, TemplateUncheckedCreateWithoutEventsInput>
  }

  export type UserCreateWithoutEventsInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutEventsInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
  }

  export type GuestCreateWithoutEventInput = {
    id?: string
    name: string
    email?: string | null
    shortCode?: string | null
    token?: string
    status?: string
    phoneNumber?: string | null
  }

  export type GuestUncheckedCreateWithoutEventInput = {
    id?: string
    name: string
    email?: string | null
    shortCode?: string | null
    token?: string
    status?: string
    phoneNumber?: string | null
  }

  export type GuestCreateOrConnectWithoutEventInput = {
    where: GuestWhereUniqueInput
    create: XOR<GuestCreateWithoutEventInput, GuestUncheckedCreateWithoutEventInput>
  }

  export type GuestCreateManyEventInputEnvelope = {
    data: GuestCreateManyEventInput | GuestCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type AlbumPhotoCreateWithoutEventInput = {
    id?: string
    imageUrl: string
    order?: number
    createdAt?: Date | string
  }

  export type AlbumPhotoUncheckedCreateWithoutEventInput = {
    id?: string
    imageUrl: string
    order?: number
    createdAt?: Date | string
  }

  export type AlbumPhotoCreateOrConnectWithoutEventInput = {
    where: AlbumPhotoWhereUniqueInput
    create: XOR<AlbumPhotoCreateWithoutEventInput, AlbumPhotoUncheckedCreateWithoutEventInput>
  }

  export type AlbumPhotoCreateManyEventInputEnvelope = {
    data: AlbumPhotoCreateManyEventInput | AlbumPhotoCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type TemplateUpsertWithoutEventsInput = {
    update: XOR<TemplateUpdateWithoutEventsInput, TemplateUncheckedUpdateWithoutEventsInput>
    create: XOR<TemplateCreateWithoutEventsInput, TemplateUncheckedCreateWithoutEventsInput>
    where?: TemplateWhereInput
  }

  export type TemplateUpdateToOneWithWhereWithoutEventsInput = {
    where?: TemplateWhereInput
    data: XOR<TemplateUpdateWithoutEventsInput, TemplateUncheckedUpdateWithoutEventsInput>
  }

  export type TemplateUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeKey?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    previewUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeKey?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutEventsInput = {
    update: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestUpsertWithWhereUniqueWithoutEventInput = {
    where: GuestWhereUniqueInput
    update: XOR<GuestUpdateWithoutEventInput, GuestUncheckedUpdateWithoutEventInput>
    create: XOR<GuestCreateWithoutEventInput, GuestUncheckedCreateWithoutEventInput>
  }

  export type GuestUpdateWithWhereUniqueWithoutEventInput = {
    where: GuestWhereUniqueInput
    data: XOR<GuestUpdateWithoutEventInput, GuestUncheckedUpdateWithoutEventInput>
  }

  export type GuestUpdateManyWithWhereWithoutEventInput = {
    where: GuestScalarWhereInput
    data: XOR<GuestUpdateManyMutationInput, GuestUncheckedUpdateManyWithoutEventInput>
  }

  export type GuestScalarWhereInput = {
    AND?: GuestScalarWhereInput | GuestScalarWhereInput[]
    OR?: GuestScalarWhereInput[]
    NOT?: GuestScalarWhereInput | GuestScalarWhereInput[]
    id?: StringFilter<"Guest"> | string
    name?: StringFilter<"Guest"> | string
    email?: StringNullableFilter<"Guest"> | string | null
    shortCode?: StringNullableFilter<"Guest"> | string | null
    token?: StringFilter<"Guest"> | string
    status?: StringFilter<"Guest"> | string
    eventId?: StringFilter<"Guest"> | string
    phoneNumber?: StringNullableFilter<"Guest"> | string | null
  }

  export type AlbumPhotoUpsertWithWhereUniqueWithoutEventInput = {
    where: AlbumPhotoWhereUniqueInput
    update: XOR<AlbumPhotoUpdateWithoutEventInput, AlbumPhotoUncheckedUpdateWithoutEventInput>
    create: XOR<AlbumPhotoCreateWithoutEventInput, AlbumPhotoUncheckedCreateWithoutEventInput>
  }

  export type AlbumPhotoUpdateWithWhereUniqueWithoutEventInput = {
    where: AlbumPhotoWhereUniqueInput
    data: XOR<AlbumPhotoUpdateWithoutEventInput, AlbumPhotoUncheckedUpdateWithoutEventInput>
  }

  export type AlbumPhotoUpdateManyWithWhereWithoutEventInput = {
    where: AlbumPhotoScalarWhereInput
    data: XOR<AlbumPhotoUpdateManyMutationInput, AlbumPhotoUncheckedUpdateManyWithoutEventInput>
  }

  export type AlbumPhotoScalarWhereInput = {
    AND?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
    OR?: AlbumPhotoScalarWhereInput[]
    NOT?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
    id?: StringFilter<"AlbumPhoto"> | string
    eventId?: StringFilter<"AlbumPhoto"> | string
    imageUrl?: StringFilter<"AlbumPhoto"> | string
    order?: IntFilter<"AlbumPhoto"> | number
    createdAt?: DateTimeFilter<"AlbumPhoto"> | Date | string
  }

  export type EventCreateWithoutGuestsInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    template?: TemplateCreateNestedOneWithoutEventsInput
    user: UserCreateNestedOneWithoutEventsInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutGuestsInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    templateId?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutGuestsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutGuestsInput, EventUncheckedCreateWithoutGuestsInput>
  }

  export type EventUpsertWithoutGuestsInput = {
    update: XOR<EventUpdateWithoutGuestsInput, EventUncheckedUpdateWithoutGuestsInput>
    create: XOR<EventCreateWithoutGuestsInput, EventUncheckedCreateWithoutGuestsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutGuestsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutGuestsInput, EventUncheckedUpdateWithoutGuestsInput>
  }

  export type EventUpdateWithoutGuestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: TemplateUpdateOneRequiredWithoutEventsNestedInput
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutGuestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateWithoutAlbumPhotosInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    template?: TemplateCreateNestedOneWithoutEventsInput
    user: UserCreateNestedOneWithoutEventsInput
    guests?: GuestCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutAlbumPhotosInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    templateId?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    guests?: GuestUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutAlbumPhotosInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutAlbumPhotosInput, EventUncheckedCreateWithoutAlbumPhotosInput>
  }

  export type EventUpsertWithoutAlbumPhotosInput = {
    update: XOR<EventUpdateWithoutAlbumPhotosInput, EventUncheckedUpdateWithoutAlbumPhotosInput>
    create: XOR<EventCreateWithoutAlbumPhotosInput, EventUncheckedCreateWithoutAlbumPhotosInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutAlbumPhotosInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutAlbumPhotosInput, EventUncheckedUpdateWithoutAlbumPhotosInput>
  }

  export type EventUpdateWithoutAlbumPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: TemplateUpdateOneRequiredWithoutEventsNestedInput
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    guests?: GuestUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutAlbumPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: GuestUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateWithoutTemplateInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutEventsInput
    guests?: GuestCreateNestedManyWithoutEventInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutTemplateInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    guests?: GuestUncheckedCreateNestedManyWithoutEventInput
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutTemplateInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutTemplateInput, EventUncheckedCreateWithoutTemplateInput>
  }

  export type EventCreateManyTemplateInputEnvelope = {
    data: EventCreateManyTemplateInput | EventCreateManyTemplateInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithWhereUniqueWithoutTemplateInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutTemplateInput, EventUncheckedUpdateWithoutTemplateInput>
    create: XOR<EventCreateWithoutTemplateInput, EventUncheckedCreateWithoutTemplateInput>
  }

  export type EventUpdateWithWhereUniqueWithoutTemplateInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutTemplateInput, EventUncheckedUpdateWithoutTemplateInput>
  }

  export type EventUpdateManyWithWhereWithoutTemplateInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutTemplateInput>
  }

  export type EventCreateManyUserInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    templateId?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: TemplateUpdateOneRequiredWithoutEventsNestedInput
    guests?: GuestUpdateManyWithoutEventNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: GuestUncheckedUpdateManyWithoutEventNestedInput
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestCreateManyEventInput = {
    id?: string
    name: string
    email?: string | null
    shortCode?: string | null
    token?: string
    status?: string
    phoneNumber?: string | null
  }

  export type AlbumPhotoCreateManyEventInput = {
    id?: string
    imageUrl: string
    order?: number
    createdAt?: Date | string
  }

  export type GuestUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GuestUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GuestUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    shortCode?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AlbumPhotoUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateManyTemplateInput = {
    id?: string
    title: string
    slug?: string | null
    date: Date | string
    location: string
    description?: string | null
    eventType?: string
    musicUrl?: string | null
    logoUrl?: string | null
    logoSize?: number
    groomFatherName?: string | null
    groomMotherName?: string | null
    brideFatherName?: string | null
    brideMotherName?: string | null
    groomFirstName?: string | null
    groomLastName?: string | null
    brideFirstName?: string | null
    brideLastName?: string | null
    invitationMessage?: string | null
    eventTime?: string | null
    venueDetails?: string | null
    mapUrl?: string | null
    startDate?: Date | string
    endDate?: Date | string | null
    eventDays?: string | null
    schedule?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    guests?: GuestUpdateManyWithoutEventNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: GuestUncheckedUpdateManyWithoutEventNestedInput
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    musicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    logoSize?: IntFieldUpdateOperationsInput | number
    groomFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFatherName?: NullableStringFieldUpdateOperationsInput | string | null
    brideMotherName?: NullableStringFieldUpdateOperationsInput | string | null
    groomFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    groomLastName?: NullableStringFieldUpdateOperationsInput | string | null
    brideFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    brideLastName?: NullableStringFieldUpdateOperationsInput | string | null
    invitationMessage?: NullableStringFieldUpdateOperationsInput | string | null
    eventTime?: NullableStringFieldUpdateOperationsInput | string | null
    venueDetails?: NullableStringFieldUpdateOperationsInput | string | null
    mapUrl?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventDays?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventCountOutputTypeDefaultArgs instead
     */
    export type EventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemplateCountOutputTypeDefaultArgs instead
     */
    export type TemplateCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventDefaultArgs instead
     */
    export type EventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GuestDefaultArgs instead
     */
    export type GuestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GuestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlbumPhotoDefaultArgs instead
     */
    export type AlbumPhotoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlbumPhotoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemplateDefaultArgs instead
     */
    export type TemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GlobalAssetDefaultArgs instead
     */
    export type GlobalAssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GlobalAssetDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}