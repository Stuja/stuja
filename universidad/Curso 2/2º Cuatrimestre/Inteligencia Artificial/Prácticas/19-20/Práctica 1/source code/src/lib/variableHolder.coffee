###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Holder for variables.
###

variables =
  Map:
    empty_ratio: .15
    chance_producer_spawn: 100
    chance_roamer_spawn: 200
  ProducerEntity:
    starting_life: 200
    life_gain_per_food: 1200
    life_to_reproduce: 600
    life_loss_to_reproduce: 400
    max_life: 600
    min_life_to_transfer: 50
    max_life_transfer: 50
    eating_cooldown: 10
    age_to_reproduce: 80
    old_age_death_multiplier: 10000000
  RoamingEntity:
    stuck_ticks: 20
    stuck_cooldown: 20
    starting_health_fresh: 100
    starting_health_clone: 20
    max_life: 200
    life_gain_per_food: 25
    life_to_reproduce: 200
    life_loss_to_reproduce: 50



module.exports = variables
