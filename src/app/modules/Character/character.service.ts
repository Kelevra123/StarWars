import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICharacter } from "./types";
import { delay } from "rxjs/operators";

@Injectable()
export class CharacterService {

  constructor(private readonly _http: HttpClient) {
  }

  public fetch(): Observable<ICharacter[]> {
    return this._http.get<ICharacter[]>('https://akabab.github.io/starwars-api/api/all.json').pipe(delay(500))
  }

  public fetchOne(id: number): Observable<ICharacter> {
    return this._http.get<ICharacter>(`https://akabab.github.io/starwars-api/api/id/${id}.json`)
  }

}
