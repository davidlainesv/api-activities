import { DateTime } from 'luxon'

export function format_datetime(date: Date): string {
    const datetime = DateTime.fromJSDate(date);
    return datetime.toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
}

export function generate_sql_update_entries(schema: any, values: any): string {
    const forbidden_properties = ["activity_id"]

    var update_entries = [];
    for (const prop in values) {
        if (!(prop in forbidden_properties)) {
            var entry = ""
            if (schema[prop] == "string") {
                entry = `${prop} = '${values[prop]}'`;
            } else {
                entry = `${prop} = ${values[prop]}`;
            }
            update_entries.push(entry);
        }
    }

    return update_entries.join(", ")
}