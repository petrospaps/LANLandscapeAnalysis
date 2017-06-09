import json
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


six_stories_soton = {"822583e8072c4f66655ab49b":(50.89967,-1.403664), "53dca9ee617b5965064e6833" :(50.902688,-1.404179),"6b3251d7db159be5dbfb637a":(50.899563,-1.405402),"b97e8521dc16ccee9580ad1d":(50.910578,-1.405019),"b53ec06f925d766c2415d510":(50.897369,-1.407312),"ab349646e7cc91ef38aa59cd":(50.902705,-1.411153),"e12ea776998b31b723712453":(50.896933,-1.394094)}

distance = 0.5


'''
lat = 50.8996
lon = -1.4037
#poly = get_polygon(lat,lon,distance)
#pois_CnE = query_spoi(poly)
#pois_H = query_lgd(poly)
#pois = pois_H.union(pois_CnE)
pois = poi_metric(lat,lon,distance)
'''


pois_dict ={}
for item in six_stories_soton:
    #print item
    lat = six_stories_soton[item][0]
    lon = six_stories_soton[item][1]
    pois_dict["location_id"] = item
    #pois_dict["lat"] = lat
    #pois_dict["lon"] = lon
    pois = poi_metric(lat, lon, distance)
    pois_dict["number of poi"] = len(pois)
    pois_dict["points of interet"] = list(pois)
    #pois_dict["number of Culture_and_Entertainment places"] = len(pois_CnE)
    #pois_dict["number of HistoricThing places"] = len(pois_H)
    #pois_dict["Culture_and_Entertainment"] = list(pois_CnE)
    #pois_dict["HistoricThing"] = list(pois_H)

print pois_dict

#json_str = json.dumps(pois_dict)

with open('data.json', 'a') as f:
    json.dump(pois_dict, f)
