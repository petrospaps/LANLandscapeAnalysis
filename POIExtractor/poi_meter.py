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



#pois = poi_metric(50.8996 , -1.4037, 0.5)
#print(pois)

distance = 0.3
lat = 50.8996
lon = -1.4037

poly = get_polygon(lat,lon,distance)
pois_CnE = query_spoi(poly)
pois_H = query_lgd(poly)
pois = pois_H.union(pois_CnE)



pois_dict ={}
pois_dict["lat"] = lat
pois_dict["lon"] = lon
pois_dict["number of poi"] = len(pois)
pois_dict["number of Culture_and_Entertainment places"] = len(pois_CnE)
pois_dict["number of HistoricThing places"] = len(pois_H)
pois_dict["Culture_and_Entertainment"] = list(pois_CnE)
pois_dict["HistoricThing"] = list(pois_H)

print pois_dict

#json_str = json.dumps(pois_dict)

with open('data.json', 'a') as f:
    json.dump(pois_dict, f)
