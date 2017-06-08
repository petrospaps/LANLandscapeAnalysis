from geolocation import GeoLocation as gl

def gen_bbox(lat,lon,distance):
    center = gl.from_degrees(lat,lon)
    SW_loc, NE_loc = center.bounding_locations(distance)
    return(SW_loc,NE_loc)

def bbox_to_square(bbox):
    """bbox is lat-lon, wkt-poly is lon-lat
    """
    sw_point = bbox[0]
    ne_point = bbox[1]
    se_point = gl.from_degrees(sw_point.deg_lat,ne_point.deg_lon)
    nw_point = gl.from_degrees(ne_point.deg_lat,sw_point.deg_lon)
    return (sw_point,nw_point,ne_point,se_point,sw_point)
    
def square_to_wkt(square):
    st = "POLYGON(("
    for point in square:
        st = st + str(point.deg_lon) + " " + str(point.deg_lat) + ","
    st= st.rstrip(',')
    st += "))"
    return st
    
#Holyrood church
bbox = gen_bbox(50.8996 , -1.4037, 0.2)
#Lincoln Theatre
#bbox = gen_bbox(38.9173 , -77.0289, 0.1)
sq = bbox_to_square(bbox)
wktliteral = square_to_wkt(sq)
print (wktliteral)
