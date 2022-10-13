export interface testModel {
    username: string
    img: string
}

export const UserData: testModel[] = []

export function addTest(test: testModel){
    UserData.push(test);
}