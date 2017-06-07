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
* [List of all type of crimes](https://www.police.uk/about-this-site/faqs/#what-do-the-crime-categories-mean)

## SPOI
* [data model] (http://sdi4apps.eu/spoi/doc/SPOI_data_model.pdf)
* [geoSparql example] (https://en.wikipedia.org/wiki/GeoSPARQL#Example)
