

ALTER TABLE `bigdata_period`.`report_list`
ADD COLUMN `region` VARCHAR(45) NULL
AFTER `taskAssignOrg`;

UPDATE `bigdata_period`.`report_list`
SET region = 'wx';
