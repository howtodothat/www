<!DOCTYPE html>
<html ng-app="{{ env('APP_NAME') }}">
<head>
<title>{{ env('APP_NAME') }}</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
{{--  <meta name="viewport" content="width=device-width, initial-scale=1" />  --}}
<base href="/" />
<link href="static/images/favicon.ico" rel="icon" type="image/x-icon" />
<?php $version = env('APP_VERSION_SCRIPT', time());?>
<link rel="stylesheet" href="{{ asset('static/css/vendor.css'). '?v='.$version }}" />
<link rel="stylesheet" href="{{ asset('static/css/styles.css'). '?v='.$version }}" />
      <title>Thegioididong.com - Siêu thị điện thoại, Tablet, Laptop, Phụ kiện chính hãng</title>
      <meta name="keywords" content="Thế giới di động, Thegioididong, điện thoại di động, dtdd, smartphone, tablet, máy tính bảng, Laptop, máy tính xách tay, phụ kiện điện thoại, tin công nghệ" />
      <meta name="description" content="Hệ thống bán lẻ điện thoại di động, smartphone, máy tính bảng, tablet, laptop, phụ kiện chính hãng mới nhất, giá tốt, dịch vụ khách hàng được yêu thích nhất VN" />
      <meta property="og:title" content="Thegioididong.com - Siêu thị điện thoại, Tablet, Laptop, Phụ kiện chính hãng" />
      <meta property="og:description" content="Hệ thống bán lẻ điện thoại di động, smartphone, máy tính bảng, tablet, laptop, phụ kiện chính hãng mới nhất, giá tốt, dịch vụ khách hàng được yêu thích nhất VN" />
      <meta content="INDEX,FOLLOW" name="robots" />
      <meta name="viewport" content="width=device-width" />
      <meta name="copyright" content="Công ty Cổ phần Thế Giới Di Động" />
      <meta name="author" content="Công ty Cổ phần Thế Giới Di Động" />
      <meta http-equiv="audience" content="General" />
      <meta name="resource-type" content="Document" />
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="1 days" />
      <meta name="GENERATOR" content="Công ty Cổ phần Thế Giới Di Động" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <link rel="publisher" href="https://plus.google.com/+Thegioididongdotcom/posts" />
      <link rel="author" href="https://plus.google.com/+Thegioididongdotcom/posts" />
      <meta property="og:site_name" content="Thegioididong.com" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="vi_VN" />
      <meta property="fb:pages" content="214993791879039" />
      <meta http-equiv="x-dns-prefetch-control" content="on">
</head>
<body class="block-ui block-ui-anim-fade">
  <toast></toast>
  <input type="hidden" name="app_version_script" value="<?php echo $version; ?>">
  <div ui-view="main">
  </div>
    <!-- ?v={{ $version }} -->
  <script type="text/javascript" src="{{ asset('static/vendor.js'). '?v='.$version }}"></script>
  <script type="text/javascript" src="{{ asset('static/app.js'). '?v='.$version }}"></script>
</body>
</html>