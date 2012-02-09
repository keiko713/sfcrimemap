import csv
import json

data = csv.reader(open('sample_sfpd_incident_all.csv'))
fields = data.next() # fields name
dic_list = []
for i, row in enumerate(data):
    if i == 1:
        continue # pass the field row
    items = zip(fields, row)
    item = {}
    for (name, value) in items:
        item[name] = value.strip()
    dic_list.append(item)

marker = {"Marker": dic_list}
fp = open("mapdata.json", "w")
json.dump(marker, fp, indent = 4)
fp.close()
