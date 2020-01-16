/* eslint-disable */
// this is an auto generated file. This will be overwritten

const ListTopics = `query ListTopics{
    listTopics{
        items {
            key: id
            name
            color
        }
    }
}`;

const ListLinks = `query ListLinks{
    listLinks {
        items {
            to
            from
        }
    }
}`;

const GetFocusTopicsLinks = `query GetFocusTopicsLinks($topicId: String!){
    listLinks (filter: {
        or: [
            {
            to : {
            eq: $topicId
            }
            }
            {
            from : {
            eq: $topicId
            }
            }
        ]
    }) {
        items {
            title
            to: toTopic {
                id
                name
            }
            from: fromTopic {
                id
                name
            }
        }
    }
}`;
