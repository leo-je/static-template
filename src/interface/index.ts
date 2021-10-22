export interface RouterInfo {
    id: string,
    name: string,
    children?: RouterInfo[],
    path: string,
    iconName: string,
    componentPath: string,
    type: string
}