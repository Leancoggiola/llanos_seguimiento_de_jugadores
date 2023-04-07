export const returnIfContentInList = (content, list) => {
    return list.contentList.find(item => content.title === item.title);
}