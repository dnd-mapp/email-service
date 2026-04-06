import { parseArrayFromString } from '@/shared-utils';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import {
    DEFAULT_CORS_ORIGINS,
    DEFAULT_DB_HOST,
    DEFAULT_DB_PORT,
    DEFAULT_DB_SCHEMA,
    DEFAULT_DB_USER,
    DEFAULT_SERVER_HOST,
    DEFAULT_SERVER_PORT,
    PORT_RANGE_MAX,
    PORT_RANGE_MIN,
} from '../constants';
import { IsHost } from './is-host.decorator';

export const EnvironmentVariableNames = {
    SERVER_HOST: 'AUTH_SERVER_HOST',
    SERVER_PORT: 'AUTH_SERVER_PORT',
    CORS_ORIGINS: 'AUTH_SERVER_CORS_ORIGINS',
    SSL_CERT_PATH: 'AUTH_SERVER_SSL_CERT_PATH',
    SSL_KEY_PATH: 'AUTH_SERVER_SSL_KEY_PATH',
    DB_HOST: 'AUTH_SERVER_DB_HOST',
    DB_PORT: 'AUTH_SERVER_DB_PORT',
    DB_SCHEMA: 'AUTH_SERVER_DB_SCHEMA',
    DB_USER: 'AUTH_SERVER_DB_USER',
    DB_PASSWORD: 'AUTH_SERVER_DB_PASSWORD',
} as const;

export class EnvironmentVariablesSchema {
    @IsHost()
    @IsOptional()
    public [EnvironmentVariableNames.SERVER_HOST]: string = DEFAULT_SERVER_HOST;

    @Max(PORT_RANGE_MAX)
    @Min(PORT_RANGE_MIN)
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
    @IsOptional()
    public [EnvironmentVariableNames.SERVER_PORT]: number = DEFAULT_SERVER_PORT;

    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @ArrayMinSize(1)
    @IsArray()
    @Transform(({ value }) => parseArrayFromString(DEFAULT_CORS_ORIGINS, value as string))
    @IsOptional()
    public [EnvironmentVariableNames.CORS_ORIGINS]!: string[];

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public [EnvironmentVariableNames.SSL_CERT_PATH]?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public [EnvironmentVariableNames.SSL_KEY_PATH]?: string;

    @IsHost()
    @IsOptional()
    public [EnvironmentVariableNames.DB_HOST]: string = DEFAULT_DB_HOST;

    @Max(PORT_RANGE_MAX)
    @Min(PORT_RANGE_MIN)
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
    @IsOptional()
    public [EnvironmentVariableNames.DB_PORT]: number = DEFAULT_DB_PORT;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public [EnvironmentVariableNames.DB_SCHEMA]: string = DEFAULT_DB_SCHEMA;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public [EnvironmentVariableNames.DB_USER]: string = DEFAULT_DB_USER;

    @IsNotEmpty()
    @IsString()
    public [EnvironmentVariableNames.DB_PASSWORD]!: string;
}
