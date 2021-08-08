class PersonDetails
{
    constructor(DV_ref, data)
    {
        this.DV_ref = DV_ref
        this.data = data

        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS'
        this.DETAILS.appendChild(this.createMainDiv())
        this.DETAILS.appendChild(this.createMainText())

        DV_ref.contentDIV.appendChild(this.DETAILS)
    }

    createMainDiv()
    {
        let profilePhoto = createIMG(
            (this.data.profile_path !== null) ? `https://image.tmdb.org/t/p/original${this.data.profile_path}` : '../img/default_person.svg',
            'DV_profile_img')

        let MainDiv = document.createElement('div')
        MainDiv.className = 'DV_profilePhotoContainer'
        MainDiv.appendChild(profilePhoto)
        return MainDiv
    }

    createMainText()
    {
        let text = document.createElement('div')
        text.className = 'DV_mainText'

        let name = document.createElement('h2')
        name.className = 'DV_name'
        name.innerHTML = this.data.name
        text.appendChild(name)

        if(this.data.biography) text.appendChild(this.getBiography())

        text.appendChild(this.getBirth())

        return text
    }

    getBiography()
    {
        let biography = document.createElement('h4')
        biography.className = 'DV_biography'
        biography.innerHTML = this.data.biography
        if(this.data.biography.length > 250) biography.style.textAlign = 'justify'
        return biography
    }

    getBirth()
    {
        let birthday = document.createElement('div')
        birthday.className = 'DV_birthday'
        birthday.innerText = 'Birth: '
        if(!this.data.place_of_birth && !this.data.birthday) birthday.innerText += '?'
        else
        {
            birthday.innerText += (this.data.place_of_birth ? this.data.place_of_birth : ' ? ') + ', '
            birthday.innerText += this.data.birthday ? this.data.birthday : ' ? '
        }
        birthday.title = `Place of birth: ${this.data.place_of_birth ? this.data.place_of_birth : ' ? '}\nDate of birth: ${this.data.birthday ? this.data.birthday : ' ? '}`
        return birthday
    }
    
}