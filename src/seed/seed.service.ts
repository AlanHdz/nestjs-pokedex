import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {
  }

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({name, url}) => {
      const segements = url.split('/');
      const no:number = +segements[segements.length - 2];

      pokemonToInsert.push({ name, no })

    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return data.results
  }

}
