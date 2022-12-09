import pl from 'tau-prolog'
const session  = pl.create()
session.consult('capra(webpack). ');

(window as any).session = session;



