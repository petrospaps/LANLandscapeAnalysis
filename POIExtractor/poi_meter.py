import square_gen as sg
import rdflib as rdf
from SPARQLWrapper import SPARQLWrapper, JSON

def get_polygon(lat,lon,sqdistance=0.1):
    bbox = sg.gen_bbox(lat , lon, sqdistance)
    sq = sg.bbox_to_square(bbox)
    wktliteral = sg.square_to_wkt(sq)
    return wktliteral

def query_spoi(polygon):
    sparql = SPARQLWrapper("http://data.plan4all.eu/sparql")
    query = """
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX poi: <http://www.openvoc.eu/poi#>

SELECT DISTINCT ?poi, ?label
WHERE  {
      ?poi rdfs:label ?label .
          ?poi poi:class <http://gis.zcu.cz/SPOI/Ontology#culture_and_entertainment> .
              ?poi geo:asWKT ?location .
                  FILTER( bif:st_intersects( ?location," """
    query = query + polygon
    query = query + "\"^^geo:wktLiteral)).}" 
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    labels = []

    for result in results["results"]["bindings"]:
        labels.append(result["label"]["value"])
    return set(labels)

def query_lgd(polygon):
    sparql = SPARQLWrapper("http://linkedgeodata.org/sparql")
    query = """
    Prefix lgdr:<http://linkedgeodata.org/triplify/>
    Prefix lgdo:<http://linkedgeodata.org/ontology/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    Prefix geom: <http://geovocab.org/geometry#>

    SELECT DISTINCT ?poi, ?label
    WHERE  {
          ?poi rdfs:label ?label .
          ?poi a lgdo:HistoricThing .
          ?poi geom:geometry [
                    geo:asWKT ?location
                        ] .
                  FILTER( bif:st_intersects( ?location," """
    query = query + polygon
    query = query + "\"^^geo:wktLiteral)).}" 

    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    labels = []

    for result in results["results"]["bindings"]:
        labels.append(result["label"]["value"])
    return set(labels)

def poi_metric(lat,lon,sqdistance):
    poly = get_polygon(lat,lon,sqdistance)
    s1 = query_spoi(poly)
    s2 = query_lgd(poly)
    return s1.union(s2)



pois = poi_metric(50.8996 , -1.4037, 0.5)
print(pois)
