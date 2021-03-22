CREATE TABLE IF NOT EXISTS `admin_users`
(
  `id`         int unsigned NOT NULL AUTO_INCREMENT,
  `username`   varchar(32) NOT NULL UNIQUE,
  `hash`       varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `deleted`    tinyint(1) NOT NULL DEFAULT 0,

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `regular_users`
(
  `id`         int unsigned NOT NULL AUTO_INCREMENT,
  `username`   varchar(32) NOT NULL UNIQUE,
  `hash`       varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `deleted`    tinyint(1) NOT NULL DEFAULT 0,

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `rooms`
(
  `id`           int unsigned NOT NULL AUTO_INCREMENT ,
  `name`         varchar(50) NOT NULL ,
  `created_by`   int unsigned NOT NULL ,
  `created_at`   datetime NOT NULL ,
  `deleted`      tinyint(1) NOT NULL DEFAULT 0 ,
  `max_capacity` int unsigned NOT NULL ,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`)
);

CREATE TABLE IF NOT EXISTS `reservations`
(
  `id`           int unsigned NOT NULL AUTO_INCREMENT ,
  `room_id`      int unsigned NOT NULL ,
  `user_id`      int unsigned NOT NULL ,
  `start_time`   datetime NOT NULL ,
  `end_time`     datetime NOT NULL ,
  `cancelled`    tinyint(1) NOT NULL DEFAULT 0 ,
  `people_count` int NOT NULL ,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `regular_users` (`id`)
);
