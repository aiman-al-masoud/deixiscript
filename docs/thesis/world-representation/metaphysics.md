- At the most basic level there is nothing but: entities, is-a-relations and
  has-as-relations. This is the "interface" through which Deixiscript
  communicates with the outer world, including JS, which only uderstands has-as
  properties (not is-a ones because JS doesn't have multiple inheritance).


- Implicit references work as if any entity got the current timestamp whenever
  it was mentioned. When function ask() is called from findAll() the deictic
  dict is NOT updated, because the results from ask() are ignored.
