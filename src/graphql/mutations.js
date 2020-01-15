/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTopic = `mutation CreateTopic($input: CreateTopicInput!) {
  createTopic(input: $input) {
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
export const updateTopic = `mutation UpdateTopic($input: UpdateTopicInput!) {
  updateTopic(input: $input) {
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
export const deleteTopic = `mutation DeleteTopic($input: DeleteTopicInput!) {
  deleteTopic(input: $input) {
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
export const createLink = `mutation CreateLink($input: CreateLinkInput!) {
  createLink(input: $input) {
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
export const updateLink = `mutation UpdateLink($input: UpdateLinkInput!) {
  updateLink(input: $input) {
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
export const deleteLink = `mutation DeleteLink($input: DeleteLinkInput!) {
  deleteLink(input: $input) {
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
