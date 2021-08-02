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
            (this.data.profile_path !== null) ? `https://image.tmdb.org/t/p/original${this.data.profile_path}` : '../img/default_backdrop.png',
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

        let biography = document.createElement('h4')
        biography.className = 'DV_biography'
        biography.innerHTML = this.data.biography
        text.appendChild(biography)

        let birthday = document.createElement('div')
        birthday.className = 'DV_birthday'
        birthday.innerText = 'Birth: ' + this.data.place_of_birth + ', ' + this.data.birthday
        text.appendChild(birthday)


        return text
    }
    
}