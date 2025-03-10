/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSlumsoccerProjects = /* GraphQL */ `
  query GetSlumsoccerProjects($projectid: String!) {
    getSlumsoccerProjects(projectid: $projectid) {
      projectid
      title
      projectType
      description
      hoverText
      imgUrl
      mainContent
      __typename
    }
  }
`;
export const listSlumsoccerProjects = /* GraphQL */ `
  query ListSlumsoccerProjects(
    $filter: TableSlumsoccerProjectsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlumsoccerProjects(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        projectid
        title
        projectType
        description
        hoverText
        imgUrl
        mainContent
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSlumsoccerGallery = /* GraphQL */ `
  query GetSlumsoccerGallery($galleryId: String!) {
    getSlumsoccerGallery(galleryId: $galleryId) {
      galleryId
      title
      imgUrl
      ef1
      __typename
    }
  }
`;
export const listSlumsoccerGalleries = /* GraphQL */ `
  query ListSlumsoccerGalleries(
    $filter: TableSlumsoccerGalleryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlumsoccerGalleries(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        galleryId
        title
        imgUrl
        ef1
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSlumsoccerPartners = /* GraphQL */ `
  query GetSlumsoccerPartners($partnerId: String!) {
    getSlumsoccerPartners(partnerId: $partnerId) {
      partnerId
      title
      imgUrl
      description
      partnershipType
      link
      ef1
      __typename
    }
  }
`;
export const listSlumsoccerPartners = /* GraphQL */ `
  query ListSlumsoccerPartners(
    $filter: TableSlumsoccerPartnersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlumsoccerPartners(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        partnerId
        title
        imgUrl
        description
        partnershipType
        link
        ef1
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSlumsoccerNews = /* GraphQL */ `
  query GetSlumsoccerNews($newsId: String!) {
    getSlumsoccerNews(newsId: $newsId) {
      newsId
      title
      imgUrl
      description
      newspaper
      link
      ef1
      ef2
      __typename
    }
  }
`;
export const listSlumsoccerNews = /* GraphQL */ `
  query ListSlumsoccerNews(
    $filter: TableSlumsoccerNewsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlumsoccerNews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        newsId
        title
        imgUrl
        description
        newspaper
        link
        ef1
        ef2
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSlumsoccerBlogs = /* GraphQL */ `
  query GetSlumsoccerBlogs($blogId: String!) {
    getSlumsoccerBlogs(blogId: $blogId) {
      blogId
      title
      imgUrl
      description
      mainContent
      date
      ef1
      ef2
      __typename
    }
  }
`;
export const listSlumsoccerBlogs = /* GraphQL */ `
  query ListSlumsoccerBlogs(
    $filter: TableSlumsoccerBlogsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlumsoccerBlogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        blogId
        title
        imgUrl
        description
        mainContent
        date
        ef1
        ef2
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSlumsoccerEvents = /* GraphQL */ `
  query GetSlumsoccerEvents($eventId: String!) {
    getSlumsoccerEvents(eventId: $eventId) {
      eventId
      title
      imgUrl
      description
      date
      mainContent
      ef1
      ef2
      __typename
    }
  }
`;
export const listSlumsoccerEvents = /* GraphQL */ `
  query ListSlumsoccerEvents(
    $filter: TableSlumsoccerEventsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlumsoccerEvents(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        eventId
        title
        imgUrl
        description
        date
        mainContent
        ef1
        ef2
        __typename
      }
      nextToken
      __typename
    }
  }
`;
