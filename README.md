# LANLandscapeAnalysis
Evaluation of locations of location aware narratives (part of the StoryPlaces project)


## List of APIs

* [Data police](https://data.police.uk/)
* [Smart POI data set](http://sdi4apps.eu/spoi/)
* [Flickr](https://www.flickr.com/services/developer/api/)

## Data police

The API doesn't need any authentication. A polygon of coordinate can be directly used. 

```
https://data.police.uk/api/crimes-street/all-crime?poly=[lat],[lng]:[lat],[lng]:[lat],[lng]
``` 
* The radius is either within a 1 mile radius of a single point, or within a custom area [source](https://data.police.uk/docs/method/crime-street/). However the location is anonymised and represent an approximation of the location [source](https://data.police.uk/about/#location-anonymisation). 
* [List of all type of crimes](https://www.police.uk/about-this-site/faqs/#what-do-the-crime-categories-mean)

## SPOI
* [data model] (http://sdi4apps.eu/spoi/doc/SPOI_data_model.pdf)
* [geoSparql example] (https://en.wikipedia.org/wiki/GeoSPARQL#Example)


## Flickr

In order to use the API, you require an API key from Flickr, which also means signing up for a Yahoo! account.  Note that API keys are for non-commercial use, unless with prior agreement from Flickr.

Of the functions which the API provides, the following are most likely to be of interest for data extraction:
* [Flickr.photos.search](https://www.flickr.com/services/api/flickr.photos.search.html).  Can be used to extract a list of photo ID's matching criteria, including image type (e.g. limit to photos only), date taken time range, place taken (either longitude, latitdue and a radius in mi/km, or a bounding box of longitudes & latitudes), Flickr "where on earth" or Flickr Places ID, geo-context (indoors/outdoors).  The information returned on each photo is minimal (it's enough to generate a link to it, not much else).  Note the results are paged.
* [Flickr.stats.getPhotoStats](https://www.flickr.com/services/api/flickr.stats.getPhotoStats.html).  For a given photo ID, returns the number of views, comments, and favourites (NB: requires the uploading user to have enabled stats for the account).
* [Flickr.photos.getInfo](https://www.flickr.com/services/api/flickr.photos.getInfo.html).  Can be used to get "full" information about a photo, given its' ID (and assuming permission to view it).  Returned data includes title, description, visibility, permissions, taken/upload dates, notes, tags, location data (longitude/latitude, Place ID, Where On Earth ID), and URL.
* [Flickr.photos.getFavourites](https://www.flickr.com/services/api/flickr.photos.getFavorites.html). Can be used to extract the set of users who have favourited an image, along with the timestamp of favouriting.  Note the results are paged.
* [Flickr.tags.getListPhoto](https://www.flickr.com/services/api/explore/flickr.tags.getListPhoto). For a given photo ID, returns the set of tags for an image.  There may be no tags, or they may be things we are not interested in, like EXIF data.
* [Flickr.places.tagsForPlace](https://www.flickr.com/services/api/flickr.places.tagsForPlace.html)
* [Flickr.photos.comments.getList](https://www.flickr.com/services/api/flickr.photos.comments.getList.html). For a given photo ID c(and optionally data bounds), returns the set of comments for the image.

Note that all of the Flickr API documentation pages have an "API explorer" option at the bottomn, which allows interactive query construction.
