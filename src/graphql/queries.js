/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTopic = `query GetTopic($id: ID!) {
  getTopic(id: $id) {
    id
    name
    description
    bucket
    nolinks
    shirtsize
    color
    links {
      items {
        id
        to
        title
        color
        owner
      }
      nextToken
    }
    tags
    owner
  }
}
`;
export const listTopics = `query ListTopics(
  $filter: ModelTopicFilterInput
  $limit: Int
  $nextToken: String
) {
  listTopics(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      bucket
      nolinks
      shirtsize
      color
      links {
        nextToken
      }
      tags
      owner
    }
    nextToken
  }
}
`;
export const getLink = `query GetLink($id: ID!) {
  getLink(id: $id) {
    id
    from {
      id
      name
      description
      bucket
      nolinks
      shirtsize
      color
      links {
        nextToken
      }
      tags
      owner
    }
    to
    title
    color
    owner
  }
}
`;
export const listLinks = `query ListLinks(
  $filter: ModelLinkFilterInput
  $limit: Int
  $nextToken: String
) {
  listLinks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      from {
        id
        name
        description
        bucket
        nolinks
        shirtsize
        color
        tags
        owner
      }
      to
      title
      color
      owner
    }
    nextToken
  }
}
`;
