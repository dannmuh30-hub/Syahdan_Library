UPDATE books b
   SET cover_url = v.url
  FROM (VALUES
 ('Laut Bercerita', 'https://i.pinimg.com/736x/9a/bb/61/9abb61fcf68afd124375a82dfd02ca6a.jpg'),
 ('Teka-Teki Gambar Aneh', 'https://i.pinimg.com/736x/65/7e/ff/657eff68573143bbffab44c67b22cca6.jpg'),
 ('Anatomi Dasar Manusia', 'https://i.pinimg.com/736x/3b/76/2f/3b762fcc9888c6892cb2b7f89f580174.jpg'),
 ('Funiculi Funicula', 'https://i.pinimg.com/736x/5b/6a/33/5b6a33dfd82dab6495972320edfab32c.jpg'),
 ('Half His Age', 'https://i.pinimg.com/736x/8e/8a/f8/8e8af8817abca7c6c072f978caa4e664.jpg'),
 ('Hukum Tata Negara', 'https://i.pinimg.com/1200x/39/13/ae/3913ae64b4f9c31165645622e7e45f7b.jpg'),
 ('Keajaiban Toko Kelontong Namiya', 'https://i.pinimg.com/736x/06/2d/49/062d499a6fb73216a0e9ecd2586802eb.jpg'),
 ('Laskar Pelangi', 'https://i.pinimg.com/736x/10/dc/06/10dc06814790d2159ade8a25ac61fa24.jpg'),
 ('My Husband''s Wife', 'https://i.pinimg.com/736x/b9/b4/1a/b9b41a8f45326279fd65a6e3edd07bb8.jpg'),
 ('Our Perfect Storm', 'https://i.pinimg.com/1200x/a4/5f/b5/a45fb53e1413ae3720b1acd2d71feead.jpg'),
 ('Pemrograman Web dengan Next.js', 'https://i.pinimg.com/736x/79/fe/f5/79fef5c6a030eeeeab34bba35e06eb48.jpg'),
 ('Pengantar Hukum Indonesia', 'https://i.pinimg.com/736x/0e/b5/4d/0eb54d8413ba97bf255183dd8dbdeb83.jpg'),
 ('Project Hail Mary', 'https://i.pinimg.com/736x/fd/f4/53/fdf4538a04bacaad6eeee3183f236322.jpg'),
 ('Seorang Pria yang Melalui Duka dengan Mencuci Piring', 'https://i.pinimg.com/736x/d8/0e/d9/d80ed93811bddff1d7b0e108ac725d40.jpg'),
 ('Rekayasa Perangkat Lunak', 'https://ebooks.gramedia.com/ebook-covers/70301/image_highres/BLK_RPL202239782.jpg'),
 ('Sisi Tergelap Surga', 'https://i.pinimg.com/736x/59/99/69/599969d075895875c16576361a30f16b.jpg'),
 ('Strangers: A Memoir of Marriage', 'https://i.pinimg.com/1200x/48/e2/8e/48e28e71bd25f59fb3859dc657cafd2e.jpg'),
 ('The Calamity Club', 'https://i.pinimg.com/236x/87/90/6f/87906f112016a50c91baf2ddc3dd0343.jpg'),
 ('The Let Them Theory', 'https://i.pinimg.com/736x/04/9a/2f/049a2f09429f1b75a2a8651c59887eba.jpg'),
 ('The Night We Met', 'https://i.pinimg.com/1200x/d7/74/20/d77420927f2ca89fd9b22ebee02f648a.jpg'),
 ('Whistler', 'https://i.pinimg.com/236x/12/6b/b6/126bb67d906a126493d1350b18fdcf36.jpg'),
 ('Yellowface', 'https://i.pinimg.com/1200x/b1/40/03/b140032e77ee3cbc20dbd03ac567b0ac.jpg'),
 ('I Want to Die but I Want to Eat Tteokbokki', 'https://cdn.gramedia.com/uploads/products/xtbt5ziitw.jpg'),
 ('Basis Data: Konsep dan PostgreSQL', 'https://i.pinimg.com/736x/6a/80/78/6a80789d013232709e870bd925050f97.jpg'),
 ('Bumi Manusia', 'https://i.pinimg.com/1200x/6c/17/a4/6c17a4b5b319770f4cb180d6bc0ab54f.jpg'),
 ('Cantik Itu Luka', 'https://i.pinimg.com/736x/0c/82/83/0c828372aed61a93e91e51d25e3cf99e.jpg'),
 ('Dear Debbie', 'https://i.pinimg.com/736x/29/87/b9/2987b9bc0f6e78d65630905b694c0b75.jpg'),
 ('Dunia Sophie', 'https://i.pinimg.com/1200x/a0/81/4b/a0814b7e021a0d3c46de19dc2993efee.jpg')
  ) AS v(judul, url)
 WHERE lower(b.judul) = lower(v.judul);
