import { CheckboxValueType } from "ant-design-vue/lib/checkbox/Group";
import { Router } from "vue-router";

export interface AppRouterState {
    router: Router | any,
    modules: any
}

export interface AppRouter {
    routerState: AppRouterState,
}

export interface RouterInfo {
    id?: string,
    name?: string,
    children?: RouterInfo[] | null,
    path?: string,
    iconName?: string,
    componentPath?: string,
    type?: string,
    statusChecked?: boolean,
    sort?: number,
    status?: string,
    pId?: string,
}


export interface UserInfo {
    id?: string,
    name?: string,
    nickName?: string,
    username?: string,
    statusChecked?: boolean,
    mainRole: MainRole,
    sex?: string,
    birthday?: any,
    roles?:Array<MainRole>,
    status?:string
}

export interface MainRole {
    key?:string,
    roleName?:string,
    roleId?: string,
    groupId?: string,
    groupName?:string,
}

export interface MainRoleGroupOptions {
    roles?: any,
    replaceFields: ReplaceFields,
    data?: any,
}

interface ReplaceFields {
    title: string,
    key: string,
}

interface SelectOption{
    value?:any,
    label?:string,
}

export interface mainRoleOptions {
    roles?: RoleInfo[],
    data?: SelectOption[],
}


export interface GroupInfo {
    id?: string,
    name?: string,
    type?: string,
    statusChecked?: boolean,
    status?: string,
    pId?: string,
}

export interface RoleInfo {
    id?: string,
    name?: string,
    statusChecked?: boolean,
    status?: string,
}

export interface Oauth2Client {
    accessTokenValidity: number,
    additionalInformation: any,
    authorities: any,
    authorizedGrantTypes: string,
    autoapprove: string,
    clientId: string,
    clientSecretValue: string,
    refreshTokenValidity: any,
    resourceIds: any,
    scope: string,
    webServerRedirectUri: string,
    authorizedGrantTypesOptionsArray:CheckboxValueType[]
}