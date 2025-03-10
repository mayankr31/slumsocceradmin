/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSlumsoccerProjects = /* GraphQL */ `
  subscription OnCreateSlumsoccerProjects(
    $projectid: String
    $title: String
    $projectType: String
    $description: String
    $hoverText: String
  ) {
    onCreateSlumsoccerProjects(
      projectid: $projectid
      title: $title
      projectType: $projectType
      description: $description
      hoverText: $hoverText
    ) {
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
export const onUpdateSlumsoccerProjects = /* GraphQL */ `
  subscription OnUpdateSlumsoccerProjects(
    $projectid: String
    $title: String
    $projectType: String
    $description: String
    $hoverText: String
  ) {
    onUpdateSlumsoccerProjects(
      projectid: $projectid
      title: $title
      projectType: $projectType
      description: $description
      hoverText: $hoverText
    ) {
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
export const onDeleteSlumsoccerProjects = /* GraphQL */ `
  subscription OnDeleteSlumsoccerProjects(
    $projectid: String
    $title: String
    $projectType: String
    $description: String
    $hoverText: String
  ) {
    onDeleteSlumsoccerProjects(
      projectid: $projectid
      title: $title
      projectType: $projectType
      description: $description
      hoverText: $hoverText
    ) {
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
export const onCreateSlumsoccerGallery = /* GraphQL */ `
  subscription OnCreateSlumsoccerGallery(
    $galleryId: String
    $title: String
    $imgUrl: String
    $ef1: AWSJSON
  ) {
    onCreateSlumsoccerGallery(
      galleryId: $galleryId
      title: $title
      imgUrl: $imgUrl
      ef1: $ef1
    ) {
      galleryId
      title
      imgUrl
      ef1
      __typename
    }
  }
`;
export const onUpdateSlumsoccerGallery = /* GraphQL */ `
  subscription OnUpdateSlumsoccerGallery(
    $galleryId: String
    $title: String
    $imgUrl: String
    $ef1: AWSJSON
  ) {
    onUpdateSlumsoccerGallery(
      galleryId: $galleryId
      title: $title
      imgUrl: $imgUrl
      ef1: $ef1
    ) {
      galleryId
      title
      imgUrl
      ef1
      __typename
    }
  }
`;
export const onDeleteSlumsoccerGallery = /* GraphQL */ `
  subscription OnDeleteSlumsoccerGallery(
    $galleryId: String
    $title: String
    $imgUrl: String
    $ef1: AWSJSON
  ) {
    onDeleteSlumsoccerGallery(
      galleryId: $galleryId
      title: $title
      imgUrl: $imgUrl
      ef1: $ef1
    ) {
      galleryId
      title
      imgUrl
      ef1
      __typename
    }
  }
`;
export const onCreateSlumsoccerPartners = /* GraphQL */ `
  subscription OnCreateSlumsoccerPartners(
    $partnerId: String
    $title: String
    $imgUrl: String
    $description: String
    $partnershipType: String
  ) {
    onCreateSlumsoccerPartners(
      partnerId: $partnerId
      title: $title
      imgUrl: $imgUrl
      description: $description
      partnershipType: $partnershipType
    ) {
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
export const onUpdateSlumsoccerPartners = /* GraphQL */ `
  subscription OnUpdateSlumsoccerPartners(
    $partnerId: String
    $title: String
    $imgUrl: String
    $description: String
    $partnershipType: String
  ) {
    onUpdateSlumsoccerPartners(
      partnerId: $partnerId
      title: $title
      imgUrl: $imgUrl
      description: $description
      partnershipType: $partnershipType
    ) {
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
export const onDeleteSlumsoccerPartners = /* GraphQL */ `
  subscription OnDeleteSlumsoccerPartners(
    $partnerId: String
    $title: String
    $imgUrl: String
    $description: String
    $partnershipType: String
  ) {
    onDeleteSlumsoccerPartners(
      partnerId: $partnerId
      title: $title
      imgUrl: $imgUrl
      description: $description
      partnershipType: $partnershipType
    ) {
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
export const onCreateSlumsoccerNews = /* GraphQL */ `
  subscription OnCreateSlumsoccerNews(
    $newsId: String
    $title: String
    $imgUrl: String
    $description: String
    $newspaper: String
  ) {
    onCreateSlumsoccerNews(
      newsId: $newsId
      title: $title
      imgUrl: $imgUrl
      description: $description
      newspaper: $newspaper
    ) {
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
export const onUpdateSlumsoccerNews = /* GraphQL */ `
  subscription OnUpdateSlumsoccerNews(
    $newsId: String
    $title: String
    $imgUrl: String
    $description: String
    $newspaper: String
  ) {
    onUpdateSlumsoccerNews(
      newsId: $newsId
      title: $title
      imgUrl: $imgUrl
      description: $description
      newspaper: $newspaper
    ) {
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
export const onDeleteSlumsoccerNews = /* GraphQL */ `
  subscription OnDeleteSlumsoccerNews(
    $newsId: String
    $title: String
    $imgUrl: String
    $description: String
    $newspaper: String
  ) {
    onDeleteSlumsoccerNews(
      newsId: $newsId
      title: $title
      imgUrl: $imgUrl
      description: $description
      newspaper: $newspaper
    ) {
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
export const onCreateSlumsoccerBlogs = /* GraphQL */ `
  subscription OnCreateSlumsoccerBlogs(
    $blogId: String
    $title: String
    $imgUrl: String
    $description: String
    $mainContent: AWSJSON
  ) {
    onCreateSlumsoccerBlogs(
      blogId: $blogId
      title: $title
      imgUrl: $imgUrl
      description: $description
      mainContent: $mainContent
    ) {
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
export const onUpdateSlumsoccerBlogs = /* GraphQL */ `
  subscription OnUpdateSlumsoccerBlogs(
    $blogId: String
    $title: String
    $imgUrl: String
    $description: String
    $mainContent: AWSJSON
  ) {
    onUpdateSlumsoccerBlogs(
      blogId: $blogId
      title: $title
      imgUrl: $imgUrl
      description: $description
      mainContent: $mainContent
    ) {
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
export const onDeleteSlumsoccerBlogs = /* GraphQL */ `
  subscription OnDeleteSlumsoccerBlogs(
    $blogId: String
    $title: String
    $imgUrl: String
    $description: String
    $mainContent: AWSJSON
  ) {
    onDeleteSlumsoccerBlogs(
      blogId: $blogId
      title: $title
      imgUrl: $imgUrl
      description: $description
      mainContent: $mainContent
    ) {
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
export const onCreateSlumsoccerEvents = /* GraphQL */ `
  subscription OnCreateSlumsoccerEvents(
    $eventId: String
    $title: String
    $imgUrl: String
    $description: String
    $date: String
  ) {
    onCreateSlumsoccerEvents(
      eventId: $eventId
      title: $title
      imgUrl: $imgUrl
      description: $description
      date: $date
    ) {
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
export const onUpdateSlumsoccerEvents = /* GraphQL */ `
  subscription OnUpdateSlumsoccerEvents(
    $eventId: String
    $title: String
    $imgUrl: String
    $description: String
    $date: String
  ) {
    onUpdateSlumsoccerEvents(
      eventId: $eventId
      title: $title
      imgUrl: $imgUrl
      description: $description
      date: $date
    ) {
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
export const onDeleteSlumsoccerEvents = /* GraphQL */ `
  subscription OnDeleteSlumsoccerEvents(
    $eventId: String
    $title: String
    $imgUrl: String
    $description: String
    $date: String
  ) {
    onDeleteSlumsoccerEvents(
      eventId: $eventId
      title: $title
      imgUrl: $imgUrl
      description: $description
      date: $date
    ) {
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
