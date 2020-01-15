/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTopic = `subscription OnCreateTopic($owner: String!) {
  onCreateTopic(owner: $owner) {
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
export const onUpdateTopic = `subscription OnUpdateTopic($owner: String!) {
  onUpdateTopic(owner: $owner) {
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
export const onDeleteTopic = `subscription OnDeleteTopic($owner: String!) {
  onDeleteTopic(owner: $owner) {
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
export const onCreateLink = `subscription OnCreateLink($owner: String!) {
  onCreateLink(owner: $owner) {
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
export const onUpdateLink = `subscription OnUpdateLink($owner: String!) {
  onUpdateLink(owner: $owner) {
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
export const onDeleteLink = `subscription OnDeleteLink($owner: String!) {
  onDeleteLink(owner: $owner) {
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
