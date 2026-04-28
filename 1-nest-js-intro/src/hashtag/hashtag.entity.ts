import { BaseEntity } from 'src/common/entities/base.entity';
import { Tweet } from 'src/tweets/tweet.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HashTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  name!: string;

  @ManyToMany(() => Tweet, (tweet) => tweet.hashTags, {
    onDelete: 'CASCADE',
  })
  tweets?: Tweet[];
}
